import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Message from "./Message";

const Messages = () => {
  const groupID = useSelector((state) => state.groupID);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    const socket = io("http://127.0.0.1:5000");
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      setMessages([]); // Clear messages before fetching new messages
      try {
        const response = await fetch("http://127.0.0.1:5000/get_messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupID: groupID,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setMessages(data.messages);
        } else {
          console.error("ERROR:", data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [groupID]);

  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  useEffect(() => {
    // Scroll to bottom after a small delay when messages are loaded
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="messages">
      {messages.length === 0 ? (
        <div className="no-messages">No conversation yet to display!!</div>
      ) : (
        messages.map((message, index) => (
          <Message key={index} message={message} />
        ))
      )}
        <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
