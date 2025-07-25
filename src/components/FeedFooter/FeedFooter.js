import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Box, IconButton, Slider, Tooltip } from "@mui/material";
import "./FeedFooter.css";

function FeedFooter({
  toggleMute,
  username,
  isMuted,
  handleToggleDialog,
  currentTime,
  duration,
  onSeek,
}) {
  const handleChange = (e) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };
  const style = {
    fontSize: "32px",
    filter: "drop-shadow(2px 2px 4px rgba(9, 8, 8, 0.5))",
  };

  return (
    <div className="feed-footer-holder hide-feed-footer-holder">
      <div className="feed-footer-container">
        <div className="timestamp">
          {Math.floor(currentTime)}:{Math.floor(duration)}
        </div>

        <IconButton sx={{ p: 0 }} onClick={() => toggleMute()}>
          {isMuted ? (
            <VolumeOffIcon style={{ color: "white" }} />
          ) : (
            <VolumeUpIcon style={{ color: "white" }} />
          )}
        </IconButton>
      </div>
      {/* <input
        className="video-seek"
        type="range"
        min={0}
        max={duration}
        step={0.1}
        value={currentTime}
        onChange={handleChange}
        style={{ width: "100%", color: "#FFF" }}
      /> */}
      <Slider
        aria-label="time-indicator"
        size="small"
        value={currentTime}
        min={0}
        step={1}
        max={duration}
        onChange={handleChange}
        sx={(t) => ({
          color: "#FFF",
          height: 4,
          "& .MuiSlider-thumb": {
            width: 8,
            height: 8,
            transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&::before": {
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            },
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0px 0px 0px 8px ${"rgb(0 0 0 / 16%)"}`,
              ...t.applyStyles("dark", {
                boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
              }),
            },
            "&.Mui-active": {
              width: 20,
              height: 20,
            },
          },
          "& .MuiSlider-rail": {
            opacity: 0.28,
          },
          ...t.applyStyles("dark", {
            color: "#fff",
          }),
        })}
      />
    </div>
  );
}

export default FeedFooter;
