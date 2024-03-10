import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import listOfUrl from '../configs/listOfUrl';
import { setAccessToken } from '../configs/auth';

interface loginPageProps{
    handleLoginFunction: () => void;
}

const LoginPage: React.FC<loginPageProps> = ({handleLoginFunction}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const Navigate = useNavigate();

  const handleLogin = () => {
    handleLoginFunction();
    postLogin(username, password);
  };

  const postLogin = async(username: string, password: string) => {
    const jsonData = {
      username: username,
      password: password,
    };
    axios.post(listOfUrl.login, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
        const accessToken = response.data.accessToken;
        setAccessToken(accessToken);
        Navigate('/');
    }).catch(err => {
        console.log(err.message);
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
          <div>
            <Typography variant="h5">Login Page</Typography>
            <form>
              <TextField
                label="Username"
                variant="outlined"
                margin="normal"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                Login
              </Button>
            </form>
          </div>
      </Paper>
    </Container>
  );
};

export default LoginPage;
