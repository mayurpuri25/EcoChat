import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import "./Homepage.css";
// import "./Welcomepage.css";

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
};

function Home() {
  return (
    <div className="mainhome-container">
      <div className="home-container">
        <h1 className="home-title">Welcome To The EcoChat</h1>
        <div className="login-reg">
          <Link to="/login" className="home-link home_login">
            Login
          </Link>
          <br />
          <Link to="/register" className="home-link home_reg">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
