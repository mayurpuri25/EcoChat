import React, { useEffect, useRef, useState } from "react";

const BotMessage = ({ message }) => {
  const ref = useRef();
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    const scrollToBottom = () => {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    scrollToBottom();

    if (message.parts && message.parts.length > 0 && message.parts[0].text) {
      setText(message.parts[0].text);
      setLoading(false);
    }
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.role === "user" ? "owner" : ""}`}
    >
      <div className="messageInfo">
        <img alt="" />
        <span>{message.role === "user" ? "You" : "EcoBot"}</span>
      </div>
      <div className="messageContent">
        {loading ? (
          <p>Loading...</p>
        ) : (
          text && <p>{text}</p>
        )}
      </div>
    </div>
  );
};

export default BotMessage;
