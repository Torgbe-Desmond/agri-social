import React from "react";
import { Box, Avatar } from "@mui/material";
import MessageItem from "./MessageItem";

function MessageList({ chatMessages, userDetails, systemPrefersDark, scrollAnchorRef }) {
  return (
    <div style={{ overflowY: "auto" }} className="group__chat-container">
      {chatMessages.map((msg, index) => (
        <MessageItem
          key={index}
          msg={msg}
          userDetails={userDetails}
          systemPrefersDark={systemPrefersDark}
        />
      ))}
      <div ref={scrollAnchorRef} />
    </div>
  );
}

export default MessageList;
