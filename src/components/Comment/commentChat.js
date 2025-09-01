import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Autocomplete,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VideoCameraBackOutlinedIcon from "@mui/icons-material/VideoCameraBackOutlined";
import { useState } from "react";
import { useTheme } from "@mui/material/styles"; 
import "./CommentChat.css";

const CommentChat = ({
  message,
  setMessage,
  handleAddComment,
  isAddingComment,
  handleMediaUpload,
  setFile,
  file = [],
  emojiAnchor,
  mediaType,
  v_media = [],
  setSelectedTags,
  setVMedia,
  closeEmojiPicker,
  media = [],
  setMedia,
  onEmojiSelect,
  openEmojiPicker,
  toggleDrawer,
  openDrawer,
  selectedTags,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const attachmentMenuOpen = Boolean(anchorEl);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const predefinedTags = [];

  const handleAttachmentClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAttachmentMenu = () => {
    setAnchorEl(null);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...file];
    const updatedPreviews = [...media];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFile(updatedImages);
    setMedia(updatedPreviews);
  };

  const handleRemoveVideo = (index) => {
    const updatedImages = [...file];
    const updatedPreviews = [...v_media];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFile(updatedImages);
    setVMedia(updatedPreviews);
  };

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      handleMediaUpload(e, "image");
    };
    input.click();
    handleCloseAttachmentMenu();
  };

  const handleAddVideo = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (e) => {
      handleMediaUpload(e, "video");
    };
    input.click();
    handleCloseAttachmentMenu();
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "40px",
      bgcolor: isDarkMode ? theme.palette.background.paper : "#FFF",
      height: "50px",
      color: theme.palette.text.primary,
      "& input": {
        color: theme.palette.text.primary,
      },
    },
  };

  const handleCommentSubmit = () => {
    if (!message.trim() && file.length === 0) return;
    handleAddComment();
  };

  const handleTagChange = (event, value) => {
    if (event && (event.key === "Enter" || event.key === " ")) {
      // optional logic on Enter/Space
    }
    setSelectedTags(value);
  };

  return (
    <Box
      sx={{
        p: 1,
        bgcolor: isDarkMode ? theme.palette.background.paper : "#FFF",
        boxShadow: "0px -1px 2px rgba(0, 0, 0, 0.1)",
        display: "grid",
        position: "sticky",
        bottom: 0,
        zIndex: 1200,
        gap: 1,
        alignItems: "center",
        pt: 1,
      }}
    >
      <Box mt={1} mb={0.5}>
        <Autocomplete
          multiple
          freeSolo
          options={predefinedTags}
          value={selectedTags}
          onChange={handleTagChange}
          size="small"
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                size="small"
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                key={index}
                sx={{ fontSize: "0.7rem", height: 24 }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              disabled={isAddingComment}
              placeholder="Tags"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 36,
                  color: theme.palette.text.primary,
                  backgroundColor: isDarkMode
                    ? theme.palette.background.default
                    : "#f9f9f9",
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "transparent" },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                input: {
                  color: theme.palette.text.primary,
                },
              }}
            />
          )}
        />
      </Box>

      <Box
        sx={{
          p: 0.5,
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          maxWidth: 600,
          maxHeight: "auto",
          borderRadius: 1,
        }}
      >
        {media?.map((m, index) => (
          <Box
            key={`img-${index}`}
            sx={{
              position: "relative",
              display: "inline-block",
              width: 100,
              height: 60,
              border: "1px solid",
              borderColor: theme.palette.divider,
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={m}
              alt={`preview-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleRemoveImage(index)}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                bgcolor: "rgba(0,0,0,0.5)",
                color: "#fff",
                padding: 0.25,
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              &times;
            </IconButton>
          </Box>
        ))}

        {v_media?.map((m, index) => (
          <Box
            key={`vid-${index}`}
            sx={{
              position: "relative",
              display: "inline-block",
              width: 100,
              height: 60,
              border: "1px solid",
              borderColor: theme.palette.divider,
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <video
              controls
              src={m}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 4,
                objectFit: "cover",
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleRemoveVideo(index)}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                bgcolor: "rgba(0,0,0,0.5)",
                color: "#fff",
                padding: 0.25,
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              &times;
            </IconButton>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex" }}>
        <TextField
          sx={textFieldStyles}
          fullWidth
          disabled={isAddingComment}
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          size="small"
          multiline
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
                <Menu
                  anchorEl={anchorEl}
                  open={attachmentMenuOpen}
                  onClose={handleCloseAttachmentMenu}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <MenuItem onClick={handleAddImage}>
                    <ImageOutlinedIcon sx={{ mr: 1 }} /> Add Image
                  </MenuItem>
                  <MenuItem onClick={handleAddVideo}>
                    <VideoCameraBackOutlinedIcon sx={{ mr: 1 }} /> Add Video
                  </MenuItem>
                </Menu>
              </>
            ),
          }}
        />

        <IconButton
          disabled={isAddingComment}
          onClick={handleCommentSubmit}
          sx={{ color: theme.palette.primary.main }}
        >
          <SendIcon />
        </IconButton>

        <EmojiPickerPopover
          anchorEl={emojiAnchor}
          onClose={closeEmojiPicker}
          onEmojiSelect={onEmojiSelect}
        />
      </Box>
    </Box>
  );
};

export default CommentChat;
