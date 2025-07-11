import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Box, Tooltip } from "@mui/material";
import "./VideoHeader.css";

function VideoHeader({ toggleMute, username, isMuted, handleToggleDialog }) {
  const style = {
    fontSize: "32px",
    filter: "drop-shadow(2px 2px 4px rgba(9, 8, 8, 0.5))",
  };

  return (
    <div className="videoHeader">
      <Tooltip sx={style} title={"STREAM"} arrow>
        <Box className="videoHeader-title">{"STREAM"}</Box>
      </Tooltip>
    </div>
  );
}

export default VideoHeader;
