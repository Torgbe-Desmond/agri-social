import React, { useEffect, useRef, useState, useCallback } from "react";
import FeedAutoplayVideo from "../FeedAutoPlay/FeedAutoPlayVideo";
import FeedFooter from "../FeedFooter/FeedFooter";

function FeedVideoCard({
  handleCurrentVideoMute,
  handlePostView,
  url,
  setCurrentVideo,
  post_id,
}) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isVideoBuffering, setIsVideoBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoViewedData, setVideoViewedData] = useState({});
  const [lastLevel, setLastLevel] = useState("unknown");

  function calculateViewedLevel(currentTime, duration) {
    if (!duration || duration === 0) return "unknown";

    const percentage = (currentTime / duration) * 100;

    if (percentage < 33) return "low";
    if (percentage < 66) return "medium";
    return "high";
  }

  useEffect(() => {
    const level = calculateViewedLevel(currentTime, duration);
  

    if (level !== lastLevel) {
      console.log("view level:", level);

      // example conditional fetch
      if (level === "high") {
        // fetchSimilarVideos();
      }

      setLastLevel(level);
    }
  }, [currentTime, duration, lastLevel]);

  // Memoized toggleMute so parent always gets latest version
  const toggleMute = useCallback(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  }, [isMuted]);

  const _toggleMute = useCallback(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = true;
      setIsMuted(true);
    }
  }, [isMuted]);

  // Expose toggleMute to parent
  useEffect(() => {
    handleCurrentVideoMute(_toggleMute);
  }, [handleCurrentVideoMute, toggleMute]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleWaiting = () => setIsVideoBuffering(true);
    const handleCanPlay = () => {
      setIsVideoLoading(false);
      setIsVideoBuffering(false);
    };
    const handleLoadStart = () => setIsVideoLoading(true);
    const handleLoadedMetadata = () => setDuration(videoElement.duration);
    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      setCurrentVideo(videoElement);
    };

    videoElement.addEventListener("waiting", handleWaiting);
    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("loadstart", handleLoadStart);
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement.removeEventListener("waiting", handleWaiting);
      videoElement.removeEventListener("canplay", handleCanPlay);
      videoElement.removeEventListener("loadstart", handleLoadStart);
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [setCurrentVideo]);

  const onVideoPress = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (isVideoPlaying) {
      videoElement.pause();
      setIsVideoPlaying(false);
    } else {
      videoElement.play().catch(() => setIsVideoPlaying(false));
      setIsVideoPlaying(true);
    }
  };

  const handleSeek = (newTime) => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div>
      <FeedAutoplayVideo
        currentTime={currentTime}
        videoRef={videoRef}
        onVideoPress={onVideoPress}
        url={url}
        handlePostView={handlePostView}
        isMuted={isMuted}
        isVideoBuffering={isVideoBuffering}
        isVideoLoading={isVideoLoading}
        isVideoPlaying={isVideoPlaying}
      />
      <FeedFooter
        videoRef={videoRef}
        toggleMute={toggleMute}
        isMuted={isMuted}
        duration={duration}
        isVideoBuffering={isVideoBuffering}
        currentTime={currentTime}
        onSeek={handleSeek}
      />
    </div>
  );
}

export default FeedVideoCard;
