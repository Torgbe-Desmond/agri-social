import React, { useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
import { useTheme, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import ComponentStack from "../HandleStack/HandleStack";
import ViewOnceFeed from "../FeedVideoCard/ViewOnceFeed";

function ViewOnceSlider({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const dispatch = useDispatch();

  console.log(slides[currentIndex].type);

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
    width: "100%",
    borderRadius: "10px",
    height: slides[currentIndex].type === "image" ? "400px" : "650pxs",
    backgroundColor: theme.palette.background.default,
  };

  const slideStyles = {
    width: "100%",
    height: "100%",
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${slides[currentIndex]?.url})`,
  };

  const arrowStyles = (side) => ({
    position: "absolute",
    top: "50%",
    [side]: "16px",
    transform: "translateY(-50%)",
    color: theme.palette.text.primary,
    background: theme.palette.action.hover,
    borderRadius: "50%",
    padding: "4px",
    cursor: "pointer",
    zIndex: 2,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.6)",
    borderRadius: "50%",
    width: 50,
    height: 50,
  });

  const dotsContainerStyles = {
    position: "absolute",
    top: "10px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  };

  const dotStyles = (active) => ({
    cursor: "pointer",
    color: active ? theme.palette.primary.main : theme.palette.secondary.main,
    fontSize: "12px",
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
      {slides[currentIndex].type === "image" ? (
        <Box sx={slideStyles}></Box>
      ) : (
        <ViewOnceFeed url={slides[currentIndex]?.url} />
      )}

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

export default ViewOnceSlider;
