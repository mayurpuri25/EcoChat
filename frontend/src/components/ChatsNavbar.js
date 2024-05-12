import React,{ useState}  from "react";
import { Button } from "primereact/button";
import CreateGroupDialog from '../components/CreateGroupDialog';  

const Navbar = () => {
  const [createGroupVisible, setCreateGroupVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("sessionID"); // Remove session ID from storage
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

        <Button label="Logout" icon="pi pi-sign-out" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Navbar;
