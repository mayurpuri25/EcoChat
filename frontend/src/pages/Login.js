import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { setCurrentUserID, setCurrentUserImage } from '../actions';
import { useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import './Login.css'; // Import the CSS file

const Login = () => {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const showError = (msg) => {
    toast.current.show({severity:'error', summary: 'Error', detail:msg, life: 3000});
  }
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('sessionID', data.sessionID); // Save session ID
        dispatch(setCurrentUserID(data.sessionID));
        localStorage.setItem('userImageURL', data.photoURL); // Save session ID
        window.location.href = '/dashboard';
      } else {
        showError(data.message);
      }
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div className="mainlogin-container">
          <Toast ref={toast} />

    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button className="login-button" type="submit">Login</button>
      </form>
      <Link className="login-link" to="/register">Don't Have An Account? Sign Up</Link>
    </div></div>
  );
};

export default Login;