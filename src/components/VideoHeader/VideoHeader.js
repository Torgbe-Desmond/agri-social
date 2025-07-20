import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import "./VideoHeader.css";

function VideoHeader({
  toggleMute,
  username,
  isMuted,
  user_image,
  handleToggleDialog,
}) {
  const style = {
    fontSize: "32px",
    filter: "drop-shadow(2px 2px 4px rgba(9, 8, 8, 0.5))",
  };

  return (
    <div className="">
      <Box className="videoHeader">
        <Avatar src={user_image || ""} sx={style} />
        <Typography>{username}</Typography>
      </Box>
    </div>
  );
}

export default VideoHeader;
