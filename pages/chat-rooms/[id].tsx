import { Box, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

interface JwtPayload {
    username: string;
    sub: string;
    iat: number;
    exp: number;
}

interface Message {
    senderId: string;
    username: string;
    content: string;
    createdAt: string;
}

function ChatRoom(){

    const router = useRouter();
    const { id } = router.query;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState('');
    const [members, setMembers] = useState<string[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            const decoded: JwtPayload = jwtDecode(token);
            setUsername(decoded.username);
        }
    }, []);

    useEffect(() => {
        socket.on('message', (data: { username: string; content: string }) => {
            setMessages((prevMessages) => [...prevMessages, { senderId: '', username: data.username, content: data.content, createdAt: new Date().toISOString() }]);
        });
        return () => {
            socket.off('message');
        };
    }, []);
      

    useEffect(() => {
        if (chatContainerRef.current){
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const fetchMembers = async () => {
            try{
                const response = await axios.get(`http://localhost:4000/chat-rooms/get-members/${id}`);
                if (response.data.statusCode === 200){
                    setMembers(response.data.data.map((member: { username: string }) => member.username));
                }
            } catch (error) {
                console.error('Error fetching members: ', error);
            }
        };
        if(id){
            fetchMembers();
        }
    }, [id]);

    useEffect(() => {
        const fetchMessages = async() => {
            try {
                const response = await axios.get(`http://localhost:4000/messages/get-chat/${id}`);
                if (response.data.statusCode === 200) {
                    setMessages(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        if (id) {
            fetchMessages();
        }
    }, [id]);

    const handleSendMessage = async () => {
        if (message.trim()) {
            const token = localStorage.getItem('jwt');
            if (token) {
                const decoded: JwtPayload = jwtDecode(token);
                const senderId = decoded.sub;
            try {
                await axios.post('http://localhost:4000/messages/send-chat', {
                    chatRoomId: id,
                    senderId,
                    content: message,
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
                socket.emit('message', { username, content: message });
                setMessage('');
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(e.key === 'Enter') {
            if (message.trim()){
                e.preventDefault();
                handleSendMessage();
            }
        }
    };

    return(
        <Container 
            sx={{
                // border: '1px solid black'
            }}
        >
            <Typography
                sx={{
                    mt: '50px'
                }}
            >
                Chat Room ID : {id}
            </Typography>
            <Box
                ref={chatContainerRef}
                sx={{
                    display: 'flex',
                    width: '100%',
                    height: '50vh',
                    border: '1px solid black',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    mt: '20px',
                    flexDirection: 'column',
                    overflowY: 'auto'
                }}
            >
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            margin: '20px 20px 20px 20px',
                            maxWidth: '300px',
                            width: 'fit-content',
                            borderRadius: '10px',
                            border: '1px solid black',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                        }}
                    >
                        <Typography
                            sx={{
                                padding: '5px 5px 5px 5px',
                                mb: '10px'
                            }}
                        >
                            {msg.username}
                        </Typography>
                        <Typography
                            sx={{
                                padding: '5px 5px 5px 5px'
                            }}
                        >
                            {msg.content}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <TextField 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                    width: '100%',
                    justifyContent: 'flex-end',
                    display: 'flex',
                    border: '1px solid black',
                    mb: '10px',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                    position: 'sticky',
                    bottom: 0,
                    padding: '10px 10px 10px 10px'
                }}
                InputProps={{
                    disableUnderline: true, // Disable the underline
                }}
                variant="standard"
                placeholder="Type a message...."
                multiline
            />
            <Typography
                sx={{
                    mt: '20px',
                }}
            >
                Member : {members.join(', ')}
            </Typography>
        </Container>
    );
}

export default ChatRoom;