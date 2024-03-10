import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { routes } from "./routes";
import {Route, Routes, useNavigate} from 'react-router-dom';
import MainLayout from './pages/mainLayout';
import LoginPage from './pages/login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const Navigate = useNavigate();

  const handleLogoutFunction  = () => {
    setLoggedIn(false);
    Navigate('/login');
  }

  const handleLoginFunction = () => {
    setLoggedIn(true);
  }

  return (
    <Routes>
      {loggedIn?
      <Route path="/" element={<MainLayout handleLogoutFunction={handleLogoutFunction}/>}>
        {routes}
      </Route>:
      <Route path="/" element={ <LoginPage handleLoginFunction={handleLoginFunction}/>}/>}      
      {/* <Route path="/login" element={ <Login handleLoginFunction={setIsLogin}/>}/> */}
      <Route path="/login" element={ <LoginPage handleLoginFunction={handleLoginFunction}/>}/>
    </Routes>
  );
}

export default App;
