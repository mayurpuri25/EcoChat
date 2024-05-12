import React, { useEffect, useRef } from "react";

const Message = ({ message }) => {
  const sessionID = localStorage.getItem("sessionID");
  const ref = useRef();

  useEffect(() => {
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
          //   src={
          //     message.senderId === currentUser.uid
          //       ? currentUser.photoURL
          //       : data.user.photoURL
          //   }
          alt=""
        />
        <span>{message.sender_username}</span>
      </div>
      <div className="messageContent">
        {message.image_url && (
          <img
            src={message.image_url}
            alt="Message"
          />
        )}
        {message.text && <p>{message.text}</p>}
        {/* <div className="timestamp">{message.timestamp}</div> */}
      </div>
    </div>
  );
};

export default Message;
