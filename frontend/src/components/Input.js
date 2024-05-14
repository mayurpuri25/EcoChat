import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';


const Input = () => {
  const toast = useRef(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const groupID = useSelector((state) => state.groupID);
  const [loading, setLoading] = useState(false); // State for loading button


  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileDelete = () => {
    setFile(null);
    inputRef.current.value = null;
  };

  const showWarn = (msg) => {
    toast.current.show({severity:'warn', summary: 'Warning', detail:msg, life: 3000});
  }
  const showInfo = () => {
    toast.current.show({severity:'info', summary: 'Info', detail:'Send Image Only Related To Environment.', life: 5000});
  }

  const handleSend = async () => {
    const timestamp = formatDate(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }).replace(/,/g, ''));
    const senderID = localStorage.getItem('sessionID'); // sender ID
    
    if (!text.trim() && !file) {
      alert("Please enter a message or select an image");
      return;
    }

    setLoading(true); // Set loading to true before sending

    try {
      let filename = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadResponse = await fetch('http://127.0.0.1:5000/upload', {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
          showWarn(uploadData.message);
          showInfo();
          // console.error("ERROR:", uploadData.message);
          setText(""); // Clear input field after sending
          setFile(null); // Clear file input
          setLoading(false); // Set loading to false after handling response
          return;
        }
        filename = uploadData.filename;
      }

      const sendResponse = await fetch('http://127.0.0.1:5000/send_text', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          timestamp: timestamp,
          senderID: senderID,
          groupID: groupID,
          filename: filename,
        }),
      });
      const sendData = await sendResponse.json();
      if (sendData.success) {
        console.log(sendData); // Handle response from the backend as needed
        setText(""); // Clear input field after sending
        setFile(null); // Clear file input
        inputRef.current.value = null; // Clear file input
      } else {
        console.error("ERROR:", sendData.message); // Log response from the backend
      }
    } catch (error) {
      console.error(error);
    } finally {
        setLoading(false); // Set loading to false after sending
    }
  };

  return (
    <div className="input">
      <Toast ref={toast} />
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        {file && (
            <div className="file-info" style={{display: 'contents', backgroundColor: '#708090'}}>
              <span>{file.name}</span>
              <i onClick={handleFileDelete} className="pi pi-times-circle"></i>
            </div>
        )}
        <label htmlFor="file">
          <i className="pi pi-image" style={{ fontSize: '1.5rem', color: '#708090', cursor: 'pointer' }}></i>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={inputRef}
            style={{ display: 'none' }}
          />
        </label>
        {loading && <span><i className="pi pi-spin pi-spinner" style={{ fontSize: '1.5rem',  color: '#708090' }}></i></span>}
        <Button onClick={handleSend} label="Send" icon="pi pi-send" disabled={loading}/>
      </div>
    </div>
  );
};

export default Input;
