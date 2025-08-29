import React, { useEffect, useState } from "react";
import "./PostStatusIcons.css";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

function VideoStatusIcons({ id, icon, count, to, action, location, status }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
    if (action) {
      action();
    }
  };

  return (
    <Box className="video-status-icon">
      <Button
        onClick={() => handleClick()}
        variant="outlined"
        color="transparent"
        startIcon={icon}
        sx={{
          textTransform: "none",
          color: "white",
          borderRadius: 20,
          borderColor: "none",
        }}
      >
        {count}
      </Button>
    </Box>
  );
}

export default VideoStatusIcons;
