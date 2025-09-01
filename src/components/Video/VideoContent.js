import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ComponentStack from "../HandleStack/HandleStack";
import "./Video.css";
import VideoFooter from "./VideoFooter";

const VideoContent = ({
  videoRef,
  onVideoPress,
  url,
  isMuted,
  isVideoBuffering,
  fullScreen,
  isVideoLoading,
  currentTime,
  toggleMute,
  commentId,
  postId,
  duration,
  onSeek,
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

  const handlePostView = (e) => {
    const post = e.target.closest(".post");
    if (post) {
      const postId = post.id.replace("post-", "");
      const stack = new ComponentStack(dispatch);
      stack.handleStack("PostView", { postId, currentTime });
      console.log("Opening PostView with:", { postId, currentTime });
    }
  };

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        type="video/mp4"
        className={
          fullScreen ? "video-player video-fit-screen" : "video-player"
        }
        src={url}
        alt="meme-me"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
      />
      {/* 
      {!isVideoPlaying && !isVideoBuffering && (
        <div className="video-overlay play-overlay">
          <PlayArrowIcon fontSize="large" style={{ color: "white" }} />
        </div>
      )} */}

      {isVideoLoading && (
        <div className="video-overlay loading-overlay">
          <CircularProgress fontSize="medium" color="inherit" />
        </div>
      )}

      {isVideoBuffering && isVideoPlaying && (
        <div className="video-overlay buffering-overlay">
          <CircularProgress fontSize="small" color="inherit" />
        </div>
      )}

      <VideoFooter
        onVideoPress={onVideoPress}
        commentId={commentId}
        postId={postId}
        videoRef={videoRef}
        toggleMute={toggleMute}
        isVideoPlaying={isVideoPlaying}
        isMuted={isMuted}
        duration={duration}
        isVideoBuffering={isVideoBuffering}
        currentTime={currentTime}
        onSeek={onSeek}
      />
    </div>
  );
};

export default VideoContent;
