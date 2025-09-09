import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function MessageInput({ message, setMessage, handleAddFile, systemPrefersDark }) {
  return (
    <Box
      sx={{ bgcolor: systemPrefersDark ? "background.color" : "#FFF" }}
      display="flex"
      position="sticky"
      bottom="0"
      zIndex="100"
      gap={1}
      alignItems="center"
      pt={1}
    >
      <Box
        sx={{
          p: 1,
          bgcolor: systemPrefersDark ? "background.paper" : "inherit",
          width: "100%",
        }}
        display="flex"
        gap={1}
        alignItems="center"
        borderTop="1px solid #ddd"
      >
        <TextField
          sx={{ bgcolor: systemPrefersDark ? "background.paper" : "inherit" }}
          fullWidth
          placeholder="Write a chat..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          size="small"
          multiline
          minRows={1}
          maxRows={3}
        />

        <IconButton onClick={handleAddFile}>📷</IconButton>
        <IconButton><SendIcon /></IconButton>
      </Box>
    </Box>
  );
}

export default MessageInput;
