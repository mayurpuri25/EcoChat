import React, { useState } from "react";
import { Button } from "primereact/button";
import CreateGroupDialog from "../components/CreateGroupDialog";
import {useSelector } from 'react-redux';


const Navbar = () => {
  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const userName = useSelector((state) => state.currentUserName);
  const photoURL = localStorage.getItem("userImageURL");

  const handleLogout = () => {
    localStorage.removeItem("sessionID"); // Remove session ID from storage
    localStorage.removeItem("userImageURL"); // Remove userImageURL from storage
    window.location.href = "/"; // Redirect to homepage
  };

  return (
    <div className="navbar">
      <span className="logo">Messages</span>
      <div className="user">
        <Button
          // label="Create Group"
          icon="pi pi-pen-to-square"
          onClick={() => setCreateGroupVisible(true)}
        />
        <CreateGroupDialog
          visible={createGroupVisible}
          onHide={() => setCreateGroupVisible(false)}
        />
        <img src={photoURL} alt="" />
        <span>{userName}</span>
        <Button label="" icon="pi pi-sign-out" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Navbar;
