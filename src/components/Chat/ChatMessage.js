import { Box, Avatar } from "@mui/material";

const ChatMessage = ({ msg, isUser, systemPrefersDark }) => {
  return (
    <Box
      display="flex"
      flexDirection={isUser ? "row-reverse" : "row"}
      alignItems="flex-start"
      p={1}
      gap={2}
      mb={2}
      className={`chat__message ${msg.sender_id}`}
    >
      <Avatar src={msg?.user_image} sx={{ width: 40, height: 40 }} />
      {isUser && msg.content && (
        <Box sx={{
          background: "#daf4ff",
          color: systemPrefersDark && "#000",
          borderRadius: 2,
          p: 1.5,
          maxWidth: "70%",
        }}>{msg.content}</Box>
      )}
      {!isUser && (
        <Box
          sx={{
            background: "#e8fef1",
            color: systemPrefersDark && "#000",
            borderRadius: 2,
            p: 1.5,
            maxWidth: "70%",
          }}
          dangerouslySetInnerHTML={{ __html: msg.content }}
        />
      )}
    </Box>
  );
};

export default ChatMessage;
