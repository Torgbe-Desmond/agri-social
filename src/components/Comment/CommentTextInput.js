// CommentTextInput.js
import { TextField, IconButton } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import { useTheme } from "@mui/material/styles";
import CommentAttachmentMenu from "./CommentAttachmentMenu";

const CommentTextInput = ({
  message,
  handleContentChange,
  isAddingComment,
  openEmojiPicker,
  handleAttachmentClick,
  anchorEl,
  attachmentMenuOpen,
  handleCloseAttachmentMenu,
  handleAddImage,
  handleAddVideo,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "40px",
      bgcolor: isDarkMode ? theme.palette.background.paper : "#FFF",
      color: theme.palette.text.primary,
      "& input": { color: theme.palette.text.primary },
    },
  };

  return (
    <TextField
      sx={textFieldStyles}
      fullWidth
      multiline
      disabled={isAddingComment}
      placeholder="Write a comment..."
      value={message}
      onChange={handleContentChange}
      size="small"
      minRows={1}
      maxRows={3}
      InputProps={{
        endAdornment: (
          <IconButton
            disabled={isAddingComment}
            onClick={openEmojiPicker}
            sx={{ color: theme.palette.text.primary }}
          >
            <InsertEmoticonIcon />
          </IconButton>
        ),
        startAdornment: (
          <>
            <IconButton
              disabled={isAddingComment}
              onClick={handleAttachmentClick}
              sx={{ color: theme.palette.text.primary }}
            >
              <AttachFileOutlinedIcon />
            </IconButton>
            <CommentAttachmentMenu
              anchorEl={anchorEl}
              open={attachmentMenuOpen}
              handleClose={handleCloseAttachmentMenu}
              handleAddImage={handleAddImage}
              handleAddVideo={handleAddVideo}
            />
          </>
        ),
      }}
    />
  );
};

export default CommentTextInput;
