import { Box, IconButton, TextField } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

function CommentTextBox({
  setComment,
  comment,
  systemPrefersDark,
  handleAddComment,
  darkMode,
  openEmojiPicker,
}) {
  return (
      <Box
        sx={systemPrefersDark ? { ...darkMode, p: 1 } : { p: 1 }}
        display="flex"
        position="sticky"
        bottom="0"
        zIndex="100"
        gap={1}
        alignItems="center"
        pt={1}
        borderTop="1px solid #ddd"
        bgcolor="#FFF"
      >
        <TextField
          fullWidth
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          size="small"
          multiline
          minRows={1}
          maxRows={3}
          InputProps={{
            endAdornment: (
              <IconButton onClick={openEmojiPicker}>
                <InsertEmoticonIcon />
              </IconButton>
            ),
          }}
          sx={{
            color: systemPrefersDark ? "#FFF" : "",
            "& .MuiInputBase-input": {
              color: systemPrefersDark ? "#FFF" : "",
              background: systemPrefersDark ? "" : "",
            },
            "& .MuiInputBase-input::placeholder": {
              color: systemPrefersDark ? "#FFF" : "",
            },
          }}
        />

        <IconButton onClick={handleAddComment} disabled={!comment.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
  );
}

export default CommentTextBox;
