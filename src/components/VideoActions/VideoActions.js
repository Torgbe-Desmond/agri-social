import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import {
  Avatar,
  Box,
  Slider,
  styled,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import BottomBarOption from "../BottomBarOption/BottomBarOption";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";
import StatusIcons from "../StatusIcons/StatusIcons";
import { useNavigate } from "react-router-dom";
import {
  deletePost,
  likePost,
  savePost,
  updateStreamLike,
  updateStreamSaved,
} from "../../Features/PostSlice";
import { useDispatch } from "react-redux";
import { predictImageInPost } from "../../Features/PredictionSlice";
import ComponentStack from "../HandleStack/HandleStack";
import PostInfo from "../PostInfo/PostInfo";
export default function VideoActions({
  toggleMute,
  likes,
  username,
  post_id,
  comments,
  user_image,
  isMuted,
  saved,
  content,
  user_id,
  handleToggleDialog,
  currentTime,
  handleChange,
  duration,
}) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("SwipeDrawer", { post_id, user_id });
  };

  const handleLikePost = () => {
    const formData = new FormData();
    formData.append("user_id", localStorage.getItem("cc_ft"));
    formData.append("post_owner", user_id);
    dispatch(likePost({ post_id, formData }))
      .unwrap()
      .then((payload) => {
        dispatch(updateStreamLike(payload));
      })
      .catch((error) => {
        // ❌ Failure logic here
        console.error("Failed to save post:", error);
      });
  };

  const handleNavigateToProfile = () => {
    navigate(`/user/${user_id}`);
  };

  const TinyText = styled(Typography)({
    fontSize: "0.75rem",
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
    color: "#FFF",
  });

  const handleSavePost = () => {
    const formData = new FormData();
    console.log(localStorage.getItem("cc_ft"));
    console.log("post_id", post_id);
    formData.append("user_id", localStorage.getItem("cc_ft"));
    dispatch(savePost({ post_id, formData }))
      .unwrap()
      .then((payload) => {
        dispatch(updateStreamSaved(payload));
      })
      .catch((error) => {
        // ❌ Failure logic here
        console.error("Failed to save post:", error);
      });
  };

  const handlePostDelete = () => {
    dispatch(deletePost({ post_id }));
  };

  const handlePredictImageInPost = () => {
    const formData = new FormData();
    formData.append("post_id", post_id);
    dispatch(predictImageInPost({ formData }));
  };

  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value);
    return `${minute}:${secondLeft}`;
  }

  const style = {
    fontSize: "32px",
    cursor: "pointer",
    filter: "drop-shadow(2px 2px 4px rgba(9, 8, 8, 0.5))",
  };

  return (
    <div className="video-actions">
      <PostInfo content={content} />

      <div className="actions">
        <StatusIcons
          sx={style}
          location={"post"}
          icon={<ModeCommentOutlinedIcon fontSize="small" />}
          action={toggleDrawer}
        />

        <StatusIcons
          sx={style}
          location={"post"}
          icon={<FavoriteBorderIcon fontSize="small" />}
          count={likes}
          action={handleLikePost}
        />
        <StatusIcons
          sx={style}
          location={"post"}
          icon={<BookmarkBorderIcon fontSize="small" />}
          count={saved}
          action={handleSavePost}
        />

        {isMuted ? (
          <StatusIcons
            sx={style}
            location={"post"}
            icon={<VolumeOffIcon fontSize="small" />}
            action={toggleMute}
          />
        ) : (
          <StatusIcons
            sx={style}
            location={"post"}
            icon={<VolumeUpIcon fontSize="small" />}
            action={toggleMute}
          />
        )}
      </div>
      {/* <input
        type="range"
        min={0}
        max={duration}
        step={0.1}
        value={currentTime}
        onChange={handleChange}
        style={{
          width: "100%",
          color: "#FFF",
          position: "absolute",
          bottom: 0,
          zIndex: 1,
        }}
      /> */}
      <Slider
        aria-label="time-indicator"
        size="small"
        value={currentTime}
        min={0}
        step={1}
        max={duration}
        onChange={handleChange}
        sx={(t) => ({
          color: "inherit",
          height: 4,
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
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: -2,
        }}
      >
        <TinyText>{formatDuration(currentTime)}</TinyText>
        <TinyText>-{formatDuration(duration - currentTime)}</TinyText>
      </Box>
    </div>
  );
}
