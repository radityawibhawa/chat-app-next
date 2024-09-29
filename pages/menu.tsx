import ProtectedRoute from "@/app/components/ProtectedRoute";
import { Avatar, Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface JwtPayload{
    username: string;
    sub: string;
    iat: string;
    exp: string;
}

interface ChatRoom {
    id: string;
    name: string;
    description: string;
}

function menu(){

    const [username, setUsername] = useState('');
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter()
 
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if(token) {
            const decoded: JwtPayload = jwtDecode(token);
            setUsername(decoded.username)
        }
    }, []);

    useEffect(() => {
        const fetchChatRooms = async () => {
            try{
                const response = await axios.get('http://localhost:4000/chat-rooms/get-chat-rooms');
                setChatRooms(response.data.data);
            } catch (error) {
                console.error('Error fetching chat rooms : ', error);
            }
        };
        fetchChatRooms();
    }, []);

    const handleJoin = async (id: string) => {
        // router.push(`/chat-rooms/${id}`)
        const token = localStorage.getItem('jwt');
        if(token){
            const decoded: JwtPayload = jwtDecode(token);
            const userId = decoded.sub;

            try{
                const response = await axios.put(
                    'http://localhost:4000/chat-rooms/insert',
                    { id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if(response.data.statusCode === 200 || response.data.message === 'User already joined'){
                    router.push(`/chat-rooms/${id}`);
                } else {
                    alert(response.data.message);
                }
            } catch (error){
                console.error('Error joining chat room:', error);
                alert('Failed to join chat room');
            }
        } else {
            alert('No JWT token found');
        }
    };

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        router.push('/login');
    };

    return(
        <ProtectedRoute>
            <Box
                sx={{
                    height: '100px',
                    width: '200px',
                    margin: '100px 0 0 200px',
                    display: 'flex',
                }}
            >
                <Avatar 
                    alt="gojo"
                    src="image.png"
                    sx={{
                        width: 50,
                        height: 50,
                    }}
                    onClick={handleAvatarClick}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
                <Typography
                    sx={{
                        padding: '15px 0 0 10px',
                    }}
                >
                    Hi, {username}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '100vh', 
                }}
            >
                <Box
                    sx={{
                        width: '75vw',
                        height: '60vh',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'row', 
                        justifyContent: 'flex-start', 
                        alignItems: 'flex-start',
                    }}
                >   
                    <Grid container spacing={8} sx={{ ml: '100px' }}>
                        {chatRooms.map((room) => (
                            <Grid size={{ xs: 3}} sx={{ border: '1px solid black', width: '250px', height: '250px', borderRadius:'10px'}}>
                                <Typography 
                                    sx={{ 
                                        display:'flex', 
                                        justifyContent:'center',
                                        mt: 3,
                                    }}
                                >
                                    {room.name} Chat Group
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    sx={{ 
                                        display: "flex",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '130px 0 0 20px',
                                        width: '22vh'
                                    }}
                                    onClick={() => handleJoin(room.id)}
                                >
                                    <Typography sx={{
                                        display:'flex',
                                        justifyContent:'center',
                                    }}>
                                        Join
                                    </Typography>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </ProtectedRoute>
    );
}

export default menu;