import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";


const BotMessage = ({ message }) => {
  const ref = useRef();
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  // const photoURL = useSelector((state) => state.currentUserImage);
  const photoURL = localStorage.getItem("userImageURL");


  console.log('URL',photoURL);
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
        {message.role === "user" ? (
          <img src={photoURL} alt="" />
        ) : (
          <img src="http://127.0.0.1:5000/uploads/reddit icon.jpeg" alt="" />
        )}
        {/* <img src="http://127.0.0.1:5000/uploads/reddit icon.jpeg" alt="" /> */}
        <span>{message.role === "user" ? "You" : "EcoBot"}</span>
      </div>
      <div className="messageContent">
        {loading ? <p>Loading...</p> :  <p><ReactMarkdown>{text}</ReactMarkdown></p>}
      </div>
    </div>
  );
};

export default BotMessage;
