import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    Container,
    CssBaseline,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const theme = createTheme();

function Register(){

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:4000/register', {
                username,
                email,
                password,
            });
            if (response.status === 201) {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
                            height: '500px',
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
                            Register Account
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
                            Email
                        </Typography>
                        <TextField 
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            sx={{
                                mt: '20px',
                                display: 'flex',
                                ml: '170px',
                            }}
                            onClick={handleRegister}
                        >
                            Register
                        </Button>
                        <Typography
                            sx={{
                                mt: '20px',
                                ml: '100px',
                            }}
                        >
                            Sudah Punya Akun?{' '}
                            <Link href="/login" passHref legacyBehavior>
                                <a style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                Login Disini
                                </a>
                            </Link>
                        </Typography>
                    </Box>    
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default Register;
