import React, { useEffect, useState, useMemo } from "react";
import { Modal, Box, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MediaSlider from "../MediaSlider/MediaSlider";
import { popComponent } from "../../Features/StackSlice";
import { useDispatch, useSelector } from "react-redux";
import MediaSliderFull from "../MediaSliderFull/MediaSliderFull";

const MediaModal = ({ postId, commentId, initialIndex = 0, videoStatus }) => {
  const [media, setMedia] = useState();
  const [videoInformation, setVideoInformation] = useState({});
  const { posts, post } = useSelector((state) => state.post);
  const { comments, singleComment } = useSelector((state) => state.comment);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    if (videoStatus) {
      setVideoInformation({
        currentTime: videoStatus?.currentTime,
        isMuted: videoStatus?.muted,
      });
    }
  }, [videoStatus]);

  console.log("videoInformation", videoInformation);

  useEffect(() => {
    if (posts?.length > 0 && postId) {
      const post = posts.find((p) => p.post_id === postId);
      setMedia(post);
    }
    if (comments?.length > 0 && commentId) {
      const comment = comments.find((c) => c.id === commentId);
      setMedia(comment);
    }
  }, [posts, postId, commentId, comments]);

  const combinedMedia = useMemo(() => {
    const mediaArray = [];
    if (media?.images) {
      mediaArray.push(
        ...media.images.split(",").map((src) => ({
          url: src.trim(),
          type: "image",
        }))
      );
    }
    if (media?.videos) {
      mediaArray.push(
        ...media.videos.split(",").map((src) => ({
          url: src.trim(),
          type: "video",
        }))
      );
    }
    return mediaArray;
  }, [media]);

  const modalStyles = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    p: 2,
    outline: "none",
    width: "100%",
    background: "rgba(0, 0, 0, 0.8)",
    height: "100%",
  };

  const contentWrapper = {
    position: "absolute",
    maxWidth: "90%",
    maxHeight: "90%",
    color: theme.palette.text.primary,
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    padding: "10px",
    flexDirection: "column",
  };

  const closeButton = {
    position: "relative",
    background: "hsla(0, 34%, 23%, 0.60)",
    color: "White",
    "&:hover": { background: "rgba(5, 4, 4, 0.8)" },
  };

  const closeButtonContainer = {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 2,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
  };

  return (
    <Modal open={true} onClose={() => dispatch(popComponent())}>
      <Box sx={modalStyles}>
        <Box sx={contentWrapper}>
          <Box sx={closeButtonContainer}>
            <IconButton
              sx={closeButton}
              onClick={() => dispatch(popComponent())}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {combinedMedia.length > 0 && (
            <MediaSliderFull
              videoInformation={videoInformation}
              slides={combinedMedia}
              initialIndex={initialIndex}
              postId={postId}
              commentId={commentId}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default MediaModal;
