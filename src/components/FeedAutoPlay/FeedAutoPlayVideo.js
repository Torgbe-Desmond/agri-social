import PlayArrowIcon from "@mui/icons-material/PlayArrow"; // Material UI Play Icon
// import "./FeedAutoplayVideo.css";
import { CircularProgress } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const FeedAutoplayVideo = ({
  videoRef,
  onVideoPress,
  url,
  isMuted,
  isVideoPlaying,
  isVideoBuffering,
  fullScreen,
  isVideoLoading,
}) => {
  return (
    <>
      <div className="video-container" onClick={onVideoPress}>
        <video
          ref={videoRef}
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
          <div className="play-button-overlay">
            <PlayArrowIcon fontSize="small" style={{ color: "white" }} />
          </div>
        ) : null}

        {isVideoLoading ? (
          <div className="video-loading">
            <CircularProgress fontSize="small" color="inherit" />
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
