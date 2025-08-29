import React, { useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
import { useTheme, Box } from "@mui/material";
import Video from "../Video/Video";
import Image from "../Image/Image";

function MediaSliderFull({
  slides,
  initialIndex = 0,
  postId,
  commentId,
  videoInformation,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const theme = useTheme();

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const sliderStyles = {
    position: "relative",
    width: "400px",
    height: "90vh",
    borderRadius: "10px",
    // overflow: "hidden",
    backgroundColor: theme.palette.background.default,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  };

  const slideStyles = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const arrowStyles = (side) => ({
    position: "absolute",
    top: "50%",
    [side]: "20px",
    transform: "translateY(-50%)",
    color: theme.palette.text.primary,
    background: "rgba(0, 0, 0, 0.6)",
    borderRadius: "50%",
    padding: "8px",
    cursor: "pointer",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  });

  const dotsContainerStyles = {
    position: "absolute",
    bottom: "20px",
    width: "100%",
    paddingTop: "5px",
    display: "flex",
    borderRadius: "20px",
    maxWidth: "100%",
    width: "auto",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    gap: "8px",
  };

  const dotStyles = (active) => ({
    cursor: "pointer",
    color: active ? "#2b2828ff" : "rgba(114, 110, 110, 0.5)",
    fontSize: "14px",
  });

  return (
    <Box sx={sliderStyles}>
      {/* Left Arrow */}
      {slides.length > 1 && (
        <Box sx={arrowStyles("left")} onClick={goToPrevious}>
          <ChevronLeft />
        </Box>
      )}

      {/* Right Arrow */}
      {slides.length > 1 && (
        <Box sx={arrowStyles("right")} onClick={goToNext}>
          <ChevronRight />
        </Box>
      )}

      {/* Slide */}
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {slides[currentIndex]?.type === "image" ? (
          <Image
            url={slides[currentIndex]?.url}
            postId={postId}
            commentId={commentId}
          />
        ) : (
          <Video
            videoInformation={videoInformation}
            postId={postId}
            commentId={commentId}
            url={slides[currentIndex]?.url}
          />
        )}
      </Box>

      {/* Dots */}
      <Box sx={dotsContainerStyles}>
        {slides.length > 1 &&
          slides.map((_, slideIndex) => (
            <Box
              key={slideIndex}
              sx={dotStyles(slideIndex === currentIndex)}
              onClick={() => goToSlide(slideIndex)}
            >
              <CircleIcon fontSize="small" />
            </Box>
          ))}
      </Box>
    </Box>
  );
}

export default MediaSliderFull;
