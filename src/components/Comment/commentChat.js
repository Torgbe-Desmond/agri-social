import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import "./CommentChat.css";

const CommentChat = ({
  message,
  setMessage,
  handleAddComment,
  handleAddFile,
  systemPrefersDark,
  emojiAnchor,
  closeEmojiPicker,
  onEmojiSelect,
  openEmojiPicker,
}) => {
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "40px",
      bgcolor: systemPrefersDark ? "background.paper" : "#FFF",
      height: "50px",
    },
  };
  return (
    <Box
      sx={{
        p: 1,
        bgcolor: systemPrefersDark ? "transparent" : "transparent",
        borderColor: "divider",
      }}
      display="flex"
      position="sticky"
      bottom="0"
      zIndex="100"
      gap={1}
      alignItems="center"
      pt={1}
    >
      <TextField
        sx={textFieldStyles}
        fullWidth
        placeholder="Write a comment..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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
      />
      <IconButton onClick={handleAddComment}>
        <SendIcon />
      </IconButton>

      <EmojiPickerPopover
        anchorEl={emojiAnchor}
        onClose={closeEmojiPicker}
        onEmojiSelect={onEmojiSelect}
      />
    </Box>
  );
};

export default CommentChat;
