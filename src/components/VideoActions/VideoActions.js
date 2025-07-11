import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Avatar, Box, SwipeableDrawer, Typography } from "@mui/material";
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
export default function VideoActions({
  toggleMute,
  likes,
  username,
  post_id,
  comments,
  user_image,
  isMuted,
  saved,
  user_id,
  handleToggleDialog,
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

  const style = {
    fontSize: "32px",
    cursor: "pointer",
    filter: "drop-shadow(2px 2px 4px rgba(9, 8, 8, 0.5))",
  };

  return (
    <div className="video-actions">
      <div className="actions">
        <Avatar src={user_image || ""} sx={style} />
        <Typography>{username}</Typography>

        <StatusIcons
          sx={style}
          location={"video"}
          icon={<ModeCommentOutlinedIcon fontSize="large" />}
          action={toggleDrawer}
        />

        <StatusIcons
          sx={style}
          location={"video"}
          icon={<FavoriteBorderIcon fontSize="large" />}
          count={likes}
          action={handleLikePost}
        />
        <StatusIcons
          sx={style}
          location={"video"}
          icon={<BookmarkBorderIcon fontSize="large" />}
          count={saved}
          action={handleSavePost}
        />

        {isMuted ? (
          <StatusIcons
            sx={style}
            location={"video"}
            icon={<VolumeOffIcon fontSize="large" />}
            action={toggleMute}
          />
        ) : (
          <StatusIcons
            sx={style}
            location={"video"}
            icon={<VolumeUpIcon fontSize="large" />}
            action={toggleMute}
          />
        )}
      </div>
    </div>
  );
}
