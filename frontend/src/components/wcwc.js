import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import './Homepage.css'; 
import "./Welcomepage.css"; 

  const Homepage = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Other routes */}
        </Routes>
      </BrowserRouter>
    );
}

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">ECO Chat</h1>
      <Link to="/login" className="home-link">Login</Link>
      <br />
      <Link to="/register" className="home-link">Register</Link>
    </div>
  );
};

export default Homepage;