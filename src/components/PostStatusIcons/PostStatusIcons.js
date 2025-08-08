import React, { useEffect, useState } from "react";
import "./PostStatusIcons.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { useSelector } from "react-redux";

function PostStatusIcons({ id, icon, count, to, action, location, status }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
    if (action) {
      action();
    }
  };

  const listOfStyles = {
    post: "status-icon",
    video: "video-action-style",
  };

  return (
    <Box className="post-status-icon">
      <Button
        onClick={() => handleClick()}
        variant="outlined"
        color="primary"
        startIcon={icon}
        sx={{
          textTransform: "none",
          borderRadius: 20,
          borderColor: "divider",
        }}
      >
        {count}
      </Button>
    </Box>
  );
}

export default PostStatusIcons;
