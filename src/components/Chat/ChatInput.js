import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({
  message,
  setMessage,
  handleSend,
  handleAddFile,
  systemPrefersDark,
}) => {
  return (
    <Box
      sx={{
        p: 1,
        bgcolor: systemPrefersDark ? "background.paper" : "#FFF",
        borderColor: "divider",
      }}
      display="flex"
      position="sticky"
      bottom="0"
      zIndex="100"
      gap={1}
      alignItems="center"
      pt={1}
      bgcolor="#FFF"
    >
      <TextField
        fullWidth
        placeholder="Write a chat..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        size="small"
        multiline
        minRows={1}
        maxRows={3}
      />
      <IconButton onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
