import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ViewOnceAutoplayVideo = ({
  videoRef,
  onVideoPress,
  url,
  isMuted,
  isVideoBuffering,
  fullScreen,
  isVideoLoading,
  currentTime,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [lastTime, setLastTime] = useState(0);
  const dispatch = useDispatch();

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

  return (
    <div className="vo-video-container" onClick={onVideoPress}>
      <video
        ref={videoRef}
        type="video/mp4"
        className={fullScreen ? "vo-video-player fullscreen" : "vo-video-player"}
        src={url}
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
      />

      {/* Play Overlay */}
      {!isVideoPlaying && !isVideoBuffering && !isVideoLoading && (
        <div className="vo-video-overlay play-overlay">
          <PlayArrowIcon fontSize="large" />
        </div>
      )}

      {/* Loading Spinner */}
      {isVideoLoading && (
        <div className="vo-video-overlay loader-overlay">
          <CircularProgress size={36} />
        </div>
      )}

      {/* Buffering Spinner */}
      {isVideoBuffering && isVideoPlaying && (
        <div className="vo-video-overlay loader-overlay">
          <CircularProgress size={28} />
        </div>
      )}
    </div>
  );
};

export default ViewOnceAutoplayVideo;
