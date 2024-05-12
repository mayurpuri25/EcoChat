import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useDispatch} from 'react-redux';
import { setGroupName } from '../actions';
import { setGroupID } from '../actions';



const Chats = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Initialize useHistory
  const dispatch = useDispatch();

  const handleSelect = (key, name) => {
    navigate(`?param=${key}`); // Navigate to a dynamic route with group ID as parameter
    dispatch(setGroupName(name));
    dispatch(setGroupID(key));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sessionID = localStorage.getItem('sessionID');
        const response = await fetch("http://127.0.0.1:5000/show_group", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionID}`, // Send session ID
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          setUserData(data); // Set user data
        } else {
          console.error(data.message); // Handle error
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <div className="chats">
      <div
          className="userChat"
          onClick={() => handleSelect(111, "EcoBot")}
        >
          <i className="pi pi-reddit" style={{ fontSize: '2.0rem' }}> </i>
          <div className="userChatInfo">
            <span>EcoBot</span>
          </div>
        </div>
      {userData && userData.groups.map(group => (
        <div
          className="userChat"
          key={group.group_ID}
          onClick={() => handleSelect(group.group_ID, group.group_name)}
        >
          <i className="pi pi-users" style={{ fontSize: '2.0rem' }}> </i>
          <div className="userChatInfo">
            <span>{group.group_name}</span>
            {/* <p>hello!</p> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;