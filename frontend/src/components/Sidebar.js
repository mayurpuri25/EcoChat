import React from "react";
import Navbar from "./ChatsNavbar"
// import Search from "./Search"
import Chats from "./Chats"
import { BrowserRouter } from 'react-router-dom';


const Sidebar = () => {

  return (
    <div className="sidebar">
      <Navbar />
      {/* <Search/> */}
      <BrowserRouter>
        <Chats/>
      </BrowserRouter>
    </div>
  );
};

export default Sidebar;