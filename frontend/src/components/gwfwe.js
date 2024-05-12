import React, { useEffect, useState, useRef } from "react";
import BotInput from "./BotInput";
import BotMessage from "./BotMessage";
import { useSelector } from "react-redux";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "primereact/button";


const EcoBotChat = () => {
  const groupID = useSelector((state) => state.groupID);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [text, setText] = useState("");

  const handleSend = async () => {
    console.log(text)
  };


  useEffect(() => {
    const run = async () => {
      // Access your API key here directly
      const API_KEY = "AIzaSyB0dmVIWZ5raZtTD230bCO2Da-j-PW2s8o";
      const genAI = new GoogleGenerativeAI(API_KEY);

      // For text-only input, use the gemini-pro model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      //   let initialChatHistory = [
      //     {
      //       role: "user",
      //       parts: [{ text: "Hello, I have 2 dogs in my house." }],
      //     },
      //     {
      //       role: "model",
      //       parts: [{ text: "Great to meet you. What would you like to know?" }],
      //     },
      //   ];

      //   setChatHistory(initialChatHistory);

      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 100,
        },
      });

      const msg = "How many paws are in my house?";

      const result = await chat.sendMessage(msg);
      const response = await result.response;
      const text = await response.text();
      const history = await chat.getHistory();
      console.log(text);
      console.log("HISTORY", history);
    };

    run();
  }, []);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>EcoBot</span>
        <div className="chatIcons">
          {/* <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" /> */}
        </div>
      </div>

      <div className="messages">
        {chatHistory.length === 0 ? (
          <div className="no-messages">Start the conversation!</div>
        ) : (
          chatHistory.map((message, index) => (
            <BotMessage key={index} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input">
        <input
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="send">
          <Button onClick={handleSend} label="Send" icon="pi pi-send" />
        </div>
      </div>
    </div>
  );
};

export default EcoBotChat;
