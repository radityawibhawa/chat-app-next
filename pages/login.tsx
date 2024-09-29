import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

function login(){

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = async () =>{
        try{
            const response = await axios.post('http://localhost:4000/auth/login', {
                username, 
                password,
            });
            if (response.data.statusCode === 200){
                localStorage.setItem('jwt', response.data.jwt);
                router.push('/menu')
            } else {
                alert('Login Failed');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('Login Error');
        }
    };



    return(
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                backgroundColor: 'teal',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden', // Prevent scrolling
            }}
        >
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '450px',
                        height: '400px',
                        // border: '1px solid black',
                        boxShadow: '5px 14px 20px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white',
                        borderRadius: '8px'
                    }}
                >
                    <Typography
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '10px',
                            fontWeight: 'bold',
                        }}
                    >
                        Login
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            mt:'20px',
                            ml:'30px',
                        }}
                    >
                        Username
                    </Typography>
                    <TextField 
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{
                            ml:'30px',
                            width: '385px',
                            mt:'10px',
                        }}
                    />
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            mt:'20px',
                            ml:'30px',
                        }}
                    >
                        Password
                    </Typography>
                    <TextField 
                        placeholder='Password'
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            ml:'30px',
                            width: '385px',
                            mt:'10px',
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label='toggle password visibility'
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge='end'
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant='contained'
                        onClick={handleLogin}
                        sx={{
                            mt: '20px',
                            display: 'flex',
                            ml: '180px',
                        }}
                    >
                        Login
                    </Button>
                    <Typography
                        sx={{
                            mt: '20px',
                            ml: '100px',
                        }}
                    >
                        Belum punya akun?{' '}
                        <Link href="/register" passHref legacyBehavior>
                            <a style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                            Daftar Disini
                            </a>
                        </Link>
                    </Typography>
                </Box>    
            </Container>
        </Box>
    );
}

export default login;