import React, { useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
import { useTheme, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import ComponentStack from "../HandleStack/HandleStack";

function MediaSlider({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [toggleMuteFn, setToggleMuteFn] = useState(null);

  const handleCurrentVideoMute = (cb) => {
    setToggleMuteFn(() => cb); // store the function
  };

  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const goToNext = () =>
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const goToSlide = (slideIndex) => setCurrentIndex(slideIndex);

  const handlePostView = (e) => {
    const isReplyComment = e.target.closest(".replies-single-comment");
    const isCommentPost = e.target.closest(".comment-single-post");
    const isPost = e.target.closest(".post");

    const stack = new ComponentStack(dispatch);

    const handleModal = (idKey, idValue) => {
      stack.handleStack("MediaModal", {
        [idKey]: idValue,
        jumpToPointInVideo: currentVideo?.currentTime,
        videoStatus: currentVideo,
      });
      if (toggleMuteFn) toggleMuteFn(); // mute current video
    };

    if (isReplyComment) {
      const commentId = isReplyComment.id?.replace(
        "replies-single-comment-",
        ""
      );
      if (commentId) handleModal("commentId", commentId);
    } else if (isCommentPost) {
      const postId = isCommentPost.id?.replace("comment-single-post-", "");
      if (postId) handleModal("postId", postId);
    } else if (isPost) {
      const postId = isPost.id?.replace("post-", "");
      if (postId) handleModal("postId", postId);
    }
  };

  const sliderStyles = {
    position: "relative",
    width: "100%",
    height: "400px",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: theme.palette.background.default,
  };

  const arrowStyles = (side) => ({
    position: "absolute",
    top: "50%",
    [side]: "16px",
    transform: "translateY(-50%)",
    color: theme.palette.text.primary,
    cursor: "pointer",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.6)",
    width: 50,
    height: 50,
    borderRadius: "50%",
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
      {slides.length > 1 && (
        <Box sx={arrowStyles("left")} onClick={goToPrevious}>
          <ChevronLeft />
        </Box>
      )}
      {slides.length > 1 && (
        <Box sx={arrowStyles("right")} onClick={goToNext}>
          <ChevronRight />
        </Box>
      )}

      {slides[currentIndex].type === "image" ? (
        <Box
          onClick={handlePostView}
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${slides[currentIndex]?.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <FeedVideoCard
          handleCurrentVideoMute={handleCurrentVideoMute}
          setCurrentVideo={setCurrentVideo}
          handlePostView={handlePostView}
          url={slides[currentIndex]?.url}
          post_id={slides[currentIndex]?.post_id}
        />
      )}

      <Box sx={dotsContainerStyles}>
        {slides.length > 1 &&
          slides.map((_, idx) => (
            <Box
              key={idx}
              sx={dotStyles(idx === currentIndex)}
              onClick={() => goToSlide(idx)}
            >
              <CircleIcon fontSize="small" />
            </Box>
          ))}
      </Box>
    </Box>
  );
}

export default MediaSlider;
