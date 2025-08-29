import PlayArrowIcon from "@mui/icons-material/PlayArrow"; // Material UI Play Icon
// import "./FeedAutoplayVideo.css";
import { CircularProgress } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useEffect, useState } from "react";
import ComponentStack from "../HandleStack/HandleStack";
import { useDispatch } from "react-redux";

const FeedAutoplayVideo = ({
  videoRef,
  onVideoPress,
  url,
  isMuted,
  isVideoBuffering,
  handlePostView,
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
    <>
      <div className="">
        <video
          ref={videoRef}
          onClick={(e) => handlePostView(e)}
          type="video/mp4"
          className={fullScreen ? "video__player fit-screen" : "video__player"}
          src={url}
          alt="meme-me"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
        />

        {!isVideoPlaying && !isVideoBuffering ? (
          <div
            className="video-loading"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.6)",
              borderRadius: "50%",
              width: 60,
              height: 60,
            }}
          >
            <PlayArrowIcon
              fontSize="large"
              style={{
                color: "white",
              }}
            />
          </div>
        ) : null}

        {isVideoLoading ? (
          <div className="video-loading">
            <CircularProgress fontSize="medium" color="inherit" />
          </div>
        ) : null}

        {isVideoBuffering && isVideoPlaying ? (
          <div className="video-loading">
            <CircularProgress fontSize="small" color="inherit" />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default FeedAutoplayVideo;
