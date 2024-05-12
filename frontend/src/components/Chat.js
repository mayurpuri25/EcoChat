import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "./Input";
import Messages from "./Messages";
import EcoBotChat from "./EcoBotChat";

const Chat = () => {
  const groupName = useSelector((state) => state.groupName);
  const [bot, setBot] = useState(0);

  useEffect(() => {
    if (groupName == "EcoBot") {
      setBot(1);
      console.log("BOT", "YES");
    } else {
      setBot(0)
      console.log("BOT", "NO");
    }
  }, [groupName]);

  return bot ? (
    <EcoBotChat />
  ) : (
    <div className="chat">
      <div className="chatInfo">
        {groupName && <span>{groupName}</span>}{" "}
        {/* Render only if groupName exists */}
        <div className="chatIcons">
          {/* <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" /> */}
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
