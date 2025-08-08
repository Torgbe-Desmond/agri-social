import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VideoCameraBackOutlinedIcon from "@mui/icons-material/VideoCameraBackOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

import { Box, IconButton, Menu, MenuItem, TextField } from "@mui/material";

const ChatInput = ({
  media = [],
  setMedia,
  setVMedia,
  setFile,
  file = [],
  v_media = [],
  mediaType,
  sendMessageLoading,
  message,
  handleMediaUpload,
  setMessage,
  handleSend,
  handleAddFile,
  systemPrefersDark,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const attachmentMenuOpen = Boolean(anchorEl);

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "40px",
      height: "50px",
    },
  };

  const handleCloseAttachmentMenu = () => {
    setAnchorEl(null);
  };

  const handleAttachmentClick = (event) => {
    setAnchorEl(event.currentTarget);
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

  return (
    <Box
      sx={{
        p: 1,
        bgcolor: systemPrefersDark ? "background.paper" : "#FFF",
        // borderColor: "divider",
        // borderTop: 1,
        boxShadow: 4,
      }}
      display="grid"
      position="sticky"
      bottom="0"
      zIndex="100"
      gap={1}
      alignItems="center"
      pt={1}
    >
      {/* Media & Video Preview Section */}
      <Box
        sx={{
          p: 0.5,
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          maxWidth: 600, // constrain width
          maxHeight: "auto", // no longer fixed height
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
              borderColor: "divider",
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
              borderColor: "divider",
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

      <Box sx={{ display: "flex", width: "100%" }}>
        {/* Chat Input Field */}
        <TextField
          sx={textFieldStyles}
          fullWidth
          placeholder="Write a chat..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          size="small"
          multiline
          disabled={sendMessageLoading}
          minRows={1}
          maxRows={3}
          InputProps={{
            startAdornment: (
              <>
                <IconButton
                  disabled={sendMessageLoading}
                  onClick={handleAttachmentClick}
                >
                  <AttachFileOutlinedIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={attachmentMenuOpen}
                  onClose={handleCloseAttachmentMenu}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "bottom", horizontal: "right" }}
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

        {/* Send Button */}
        <IconButton onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInput;
