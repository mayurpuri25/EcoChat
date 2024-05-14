import React, { useState, useRef } from 'react';
import {Link } from 'react-router-dom';
import { setCurrentUserID, setCurrentUserImage } from '../actions';
import { useDispatch} from 'react-redux';
import { Toast } from 'primereact/toast';



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
        // console.log('URLLL',data.photoURL);
        localStorage.setItem('userImageURL', data.photoURL); // Save session ID
        // dispatch(setCurrentUserImage(data.photoURL));
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        showError(data.message);
        // console.error(data.message); // Handle login error
      }
    } catch (error) {
      showError(error);
      // console.error(error); // Handle network error
    }
  };
  

  return (
    <div >
      <Toast ref={toast} />
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
