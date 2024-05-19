import React, { useState } from "react";
import { Button } from "primereact/button";
import CreateGroupDialog from "../components/CreateGroupDialog";
import { useSelector } from "react-redux";

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
      <span className="logo" style={{ fontSize: "larger" }}>
        Chats
      </span>
      <div className="user">
        <div className="display_user">
          <img src={photoURL} alt="" />
          <span >{userName}</span>
        </div>
        <Button
          placeholder="Bottom"
          tooltip="Create Group"
          tooltipOptions={{ position: "bottom" }}
          icon="pi pi-pen-to-square"
          onClick={() => setCreateGroupVisible(true)}
        />
        <CreateGroupDialog
          visible={createGroupVisible}
          onHide={() => setCreateGroupVisible(false)}
        />
        <Button
          placeholder="Bottom"
          tooltip="Log Out"
          tooltipOptions={{ position: "bottom" }}
          icon="pi pi-sign-out"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Navbar;
