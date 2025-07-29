import { Box, Avatar } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";

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
        <Box
          sx={{
            background: "#daf4ff",
            gap: 1,
            color: systemPrefersDark && "#000",
            display: "flex",
            borderRadius: 2,

            p: 1.5,
            maxWidth: "70%",
          }}
        >
          <Box>{msg.content}</Box>
          <DoneAllIcon />
        </Box>
      )}
      {!isUser && (
        <Box
          sx={{
            background: "#e8fef1",
            display: "flex",
            color: systemPrefersDark && "#000",
            borderRadius: 2,
            p: 1.5,
            maxWidth: "70%",
          }}
        >
          <Box>{msg.content}</Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatMessage;
