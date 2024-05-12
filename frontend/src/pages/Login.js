import React, { useState } from 'react';
import {Link } from 'react-router-dom';
import { setCurrentUserID } from '../actions';
import { useDispatch} from 'react-redux';



const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

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
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        console.error(data.message); // Handle login error
      }
    } catch (error) {
      console.error(error); // Handle network error
    }
  };
  

  return (
    <div >
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <Link to="/register">Don't Have An Account? Sign Up</Link>
    </div>
  );
};

export default Login;
