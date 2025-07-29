import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { useSelector } from "react-redux";

function NotificationStatus({ icon, action }) {
  const navigate = useNavigate();
  const { systemPrefersDark } = useOutletContext();

  const handleClick = () => {
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
      ></Button>
    </Box>
  );
}

export default NotificationStatus;
