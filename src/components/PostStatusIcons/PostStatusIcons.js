import React, { useEffect, useState } from "react";
import "./PostStatusIcons.css";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, IconButton } from "@mui/material";

function PostStatusIcons({
  icon,
  count,
  to,
  action,
  location,
  status,
  post_id,
}) {
  const navigate = useNavigate();
  const [id, setId] = useState();

  const handleClick = (id, status) => {
    if (to) {
      navigate(to);
    }
    if (action) {
      action()
    }
  };

  const listOfStyles = {
    post: "status-icon",
    video: "video-action-style",
  };

  return (
    <Box className="post-status-icon">
      <IconButton
        onClick={() => handleClick(post_id, status)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <div className="status-btn-icon">{icon}</div>
        <div className="status-btn-count">{count}</div>
      </IconButton>
    </Box>
  );
}

export default PostStatusIcons;
