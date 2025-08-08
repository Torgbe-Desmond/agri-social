import React from "react";
import { Box, Avatar, IconButton } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";

/**
 * ChatMessage component to display a single chat message
 *
 * @param {Object} msg - The message object containing content, images, sender info, etc.
 * @param {boolean} isUser - Indicates if the message is from the current user
 * @param {boolean} systemPrefersDark - Indicates if system is in dark mode
 */
const ChatMessage = ({ msg, isUser, systemPrefersDark }) => {
  // Safely split image and video strings into arrays

  const handleImageAndVideoConversion = (msg) => {
    let imageList;
    let videoList;

    if (Array.isArray(msg.images)) {
      imageList = msg.images;
    } else {
      imageList = msg?.images ? msg.images.split(",").filter(Boolean) : [];
    }

    if (Array.isArray(msg.images)) {
      videoList = msg.video;
    } else {
      videoList = msg?.videos ? msg.videos.split(",").filter(Boolean) : [];
    }

    return {
      imageList,
      videoList,
    };
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
    >
      <Avatar src={msg?.user_image} sx={{ width: 40, height: 40 }} />

      <Box
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
        }}
      >
        {/* Display images if any */}
        {imageList.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={1}>
            {imageList.map((img, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "inline-block",
                  position: "relative",
                  margin: "4px",
                }}
              >
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
                {/* Optional image delete button */}
                {/* <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                  }}
                  onClick={() => handleImageDelete(img)} // implement this if needed
                >
                  &times;
                </IconButton> */}
              </Box>
            ))}
          </Box>
        )}

        {/* Display videos if any */}
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

        {/* Message text content */}
        <Box>{msg.content}</Box>

        {/* Message status (if user) */}
        {isUser && (
          <Box display="flex" justifyContent="flex-end" mt={0.5}>
            {/* Example logic: adjust according to your actual status */}
            {msg.status === "read" ? (
              <DoneAllIcon fontSize="small" />
            ) : (
              <DoneIcon fontSize="small" />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessage;
