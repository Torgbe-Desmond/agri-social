import React from "react";
import "./Video.css";
import { Box } from "@mui/material";

function VideoInfo({ media }) {
  const style = {
    fontSize: "32px",
    cursor: "pointer",
    filter: "drop-shadow(2px 2px 4px rgba(9, 8, 8, 0.5))",
  };
  return (
    <Box sx={{ color: "#FFF" }} className="video-info">
      {media?.content}
    </Box>
  );
}

export default VideoInfo;
