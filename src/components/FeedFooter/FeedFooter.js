import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Box, IconButton, Tooltip } from "@mui/material";
import "./FeedFooter.css";

function FeedFooter({ toggleMute, username, isMuted, handleToggleDialog }) {
  const style = {
    fontSize: "32px",
    filter: "drop-shadow(2px 2px 4px rgba(9, 8, 8, 0.5))",
  };

  return (
    <div className="feed-footer-container">
      <IconButton onClick={() => toggleMute()}>
        {isMuted ? (
          <VolumeOffIcon style={{ color: "white" }} />
        ) : (
          <VolumeUpIcon style={{ color: "white" }} />
        )}
      </IconButton>
    </div>
  );
}

export default FeedFooter;
