import React, { useEffect, useRef } from "react";

const Message = ({ message }) => {
  const sessionID = localStorage.getItem("sessionID");
  const ref = useRef();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  useEffect(() => {
    console.log(message);

    const scrollToBottom = () => {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    scrollToBottom();
  }, [message]);

  // console.log("Message:", message); // Add this line to check the received message

  return (
    <div
      ref={ref}
      className={`message ${message.sender_ID == sessionID ? "owner" : ""}`}
    >
      <div className="messageInfo">
        <img
          src={message.photoURL}
          alt=""
        />
        <span>{message.sender_ID == sessionID? "you ":message.sender_username}</span>
      </div>
      <div className="messageContent">
        {message.image_url && (
          <img
            src={message.image_url}
            alt="Message"
          />
        )}
        {message.text && <p>{message.text}</p>}
        <div className="timestamp">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
};

export default Message;
