import { Box, Avatar } from "@mui/material";
import ChatMessage from "./ChatMessage";

const ChatMessageList = ({ messages, userDetails, systemPrefersDark, scrollRef }) => {
  return (
    <div className="chat__chat-container" style={{ overflowY: "auto" }}>
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          msg={msg}
          isUser={msg.sender_id === userDetails?.id}
          systemPrefersDark={systemPrefersDark}
          userDetails={userDetails}
        />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatMessageList;

