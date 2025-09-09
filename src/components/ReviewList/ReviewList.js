import React, { useState } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const ReviewChat = ({ msg, systemPrefersDark }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setLiked] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleLike = () => setLiked((prev) => !prev);

  // id=created_review.id,
  // product_id=created_review.product_id,
  // created_at=created_review.created_at,
  // content=created_review.content,
  // user_id=created_review.user_id,

  {
    /* Loader for fetching more reviews */
  }

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      p={1}
      gap={2}
      mb={2}
      className={`chat__message ${msg.id}`}
      sx={{ position: "relative" }}
    >
  

      {/* User avatar */}
      <Tooltip title={msg?.username || "Unknown"}>
        <Avatar src={msg?.user_image} sx={{ width: 40, height: 40 }} />
      </Tooltip>

      {/* Message content */}
      <Box
        className="glass-effect"
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          boxShadow: 1,
          p: 1.5,
          maxWidth: "auto",
          gap: 1,
          position: "relative",
        }}
      >
        <Box>{msg?.content}</Box>

        {/* Timestamp */}
        {msg.created_at && (
          <Typography variant="caption" sx={{ alignSelf: "flex-end" }}>
            {new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        )}

        {/* Reactions */}
        {/* <Box display="flex" alignItems="center" gap={1}>
          <IconButton size="small" onClick={toggleLike}>
            <ThumbUpIcon
              color={liked ? "primary" : "disabled"}
              fontSize="small"
            />
          </IconButton>

          <IconButton size="small" sx={{}} onClick={handleMenuOpen}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Report</MenuItem>
          </Menu>
        </Box> */}

        {/* Options menu */}
      </Box>
    </Box>
  );
};

export default ReviewChat;
