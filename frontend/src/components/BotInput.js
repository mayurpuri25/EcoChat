import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { useSelector } from 'react-redux';

const BotInput = () => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const groupID = useSelector((state) => state.groupID);



  const handleSend = async () => {
    
  };

  return (
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
  );
};

export default BotInput;
