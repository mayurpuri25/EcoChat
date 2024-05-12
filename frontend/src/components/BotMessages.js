import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import BotMessage from "./BotMessage";
import { GoogleGenerativeAI } from "@google/generative-ai";

const BotMessages = () => {
  const groupID = useSelector((state) => state.groupID);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);


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
      console.log("HISTORY",history);
    };

    run();
  }, []);


  useEffect(() => {
    // Scroll to bottom after a small delay when messages are loaded
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  return (
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
  );
};

export default BotMessages;
