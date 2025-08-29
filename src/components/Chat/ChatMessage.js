import React, { useState } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
/**
 * ChatMessage component to display a single chat message
 *
 * @param {Object} msg - The message object containing content, images, sender info, etc.
 * @param {boolean} isUser - Indicates if the message is from the current user
 * @param {boolean} systemPrefersDark - Indicates if system is in dark mode
 * @param {Function} onDelete - Callback when delete is clicked
 */
const ChatMessage = ({ msg, isUser, systemPrefersDark, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // handle opening/closing the menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) onDelete(msg); // pass message to parent for deletion
  };

  // Safely split image and video strings into arrays
  const handleImageAndVideoConversion = (msg) => {
    const imageList = Array.isArray(msg.images)
      ? msg.images
      : msg?.images
      ? msg.images.split(",").filter(Boolean)
      : [];

    const videoList = Array.isArray(msg.videos)
      ? msg.videos
      : msg?.videos
      ? msg.videos.split(",").filter(Boolean)
      : [];

    return { imageList, videoList };
  };

  const { imageList, videoList } = handleImageAndVideoConversion(msg);

  return (
    <Box
      display="flex"
      flexDirection={isUser ? "row-reverse" : "row"}
      alignItems="flex-start"
      p={1}
      gap={2}
      mb={2}
      className={`chat__message ${msg.sender_id}`}
      sx={{ position: "relative" }}
    >
      <Avatar src={msg?.user_image} sx={{ width: 40, height: 40 }} />

      <Box
        className="glass-effect"
        sx={{
          background: isUser ? "#daf4ff" : "#e8fef1",
          color: systemPrefersDark ? "#000" : "inherit",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          boxShadow: 1,
          p: 1.5,
          maxWidth: "70%",
          gap: 1,
          position: "relative",
        }}
      >
        {/* Ellipsis button (only show if user’s own message) */}

        {/* Images */}
        {imageList.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={1}>
            {imageList.map((img, idx) => (
              <Box key={idx} sx={{ position: "relative" }}>
                <img
                  src={img}
                  alt={`Uploaded image ${idx + 1}`}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Videos */}
        {videoList.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={1}>
            {videoList.map((video, idx) => (
              <video
                key={idx}
                src={video}
                controls
                style={{
                  width: 160,
                  height: 120,
                  borderRadius: 8,
                  background: "#000",
                }}
              />
            ))}
          </Box>
        )}

        {/* Message text */}
        <Box>{msg.content}</Box>

        {/* Status (only if user) */}
        {isUser && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
            }}
          >
            {/* <Box display="flex" justifyContent="flex-end" mt={0.5}> */}
            {msg.status === "read" ? (
              <DoneAllIcon fontSize="small" />
            ) : (
              <DoneIcon fontSize="small" />
            )}
            {/* </Box> */}

            <Tooltip title="More options">
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  position: "absolute",
                  mt: 1,
                  right: 4,
                  opacity: 1,
                  color: "#000",
                  transition: "opacity 0.2s",
                  // "&:hover": { opacity: 1 },
                  // ".chat__message:hover &": { opacity: 1 },
                }}
              >
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessage;
