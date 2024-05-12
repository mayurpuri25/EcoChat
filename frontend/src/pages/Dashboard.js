import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import CreateGroupDialog from '../components/CreateGroupDialog';   
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'     
import NoChat from '../components/No_chat';
import {useSelector } from 'react-redux';
   

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const groupName = useSelector((state) => state.groupName);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sessionID = localStorage.getItem('sessionID');
        const response = await fetch('http://127.0.0.1:5000/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${sessionID}`, // Send session ID
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setUserData(data); // Set user data
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sessionID'); // Remove session ID from storage
    window.location.href = '/'; // Redirect to homepage
  };

  return (
    <div>
  
      <div className="home">
        <div className="container">
          <Sidebar />
          {groupName ? <Chat /> : <NoChat/>}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
