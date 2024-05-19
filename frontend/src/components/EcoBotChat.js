import React, { useState, useRef } from "react";
import BotMessage from "./BotMessage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "primereact/button";

const EcoBotChat = () => {
  const messagesEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);



  // API key setup
  const API_KEY = "AIzaSyB0dmVIWZ5raZtTD230bCO2Da-j-PW2s8o";
  const genAI = new GoogleGenerativeAI(API_KEY);

  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const handleSend = async () => {
    setLoading(true);
    try{
      const result = await model.generateContent(inputText);
      const response = await result.response;
      const text = response.text();
      // const markdownText = marked.marked(text); // Convert to Markdown
      const msgContentInput = { role: "user", parts: [{ text: inputText }] };
      const msgContentOutput = { role: "model", parts: [{ text: text }] };
      const contents = [...chatHistory, msgContentInput, msgContentOutput];
      setChatHistory(contents);
      setInputText('')
    }catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

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
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          disabled={loading}
          onKeyPress={handleKeyPress}

        />
        <div className="send">
          {loading && <span><i className="pi pi-spin pi-spinner" style={{ fontSize: '1.5rem',  color: '#708090' }}></i></span>}
          <Button onClick={handleSend}
           label="Send" 
           icon="pi pi-send" disabled={loading}/>
        </div>
      </div>
    </div>
  );
};

export default EcoBotChat;
