import React, { useEffect, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Box, IconButton, Slider, styled, Typography } from "@mui/material";
import "./FeedFooter.css";

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 1,
  fontWeight: 500,
  letterSpacing: 0.2,
  padding: 2,
  color: "#FFF",
});

function FeedFooter({
  toggleMute,
  isMuted,
  isVideoBuffering,
  currentTime,
  videoRef,
  duration,
  onSeek,
}) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [lastTime, setLastTime] = useState(0);

  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value);
    return `${minute}:${secondLeft}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;

        if (!isVideoBuffering && currentTime > lastTime) {
          setIsVideoPlaying(true);
        } else if (!isVideoBuffering && currentTime === lastTime) {
          setIsVideoPlaying(false);
        }

        setLastTime(currentTime);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [videoRef, lastTime, isVideoBuffering]);

  const style = {
    filter: "drop-shadow(5px 5px 10px rgba(9, 8, 8, 0.5))",
    color: "white",
  };

  return (
    <div className="feed-footer-holder">
      <div className="feed-footer-container">
        {/* Show mute/unmute + slider only when video is playing */}
        {isVideoPlaying && !isVideoBuffering && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.6)",
                borderRadius: "50%",
                width: 45,
                height: 45,
                padding: "10px 5px",
              }}
            >
              <TinyText>{formatDuration(currentTime)}</TinyText>
            </Box>

            <IconButton
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.6)",
                borderRadius: "50%",
                width: 45,
                height: 45,
              }}
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeOffIcon style={style} />
              ) : (
                <VolumeUpIcon style={style} />
              )}
            </IconButton>

            {/* <Slider
              aria-label="time-indicator"
              size="small"
              value={currentTime}
              min={0}
              step={1}
              max={duration}
              onChange={(e, newValue) => onSeek(newValue)}
              sx={(t) => ({
                color: "#FFF",
                height: 4,
                flex: 1,
                filter: "drop-shadow(5px 5px 10px rgba(9, 8, 8, 0.5))",
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
            /> */}
          </>
        )}
      </div>
    </div>
  );
}

export default FeedFooter;
