import React, { useEffect, useRef } from "react";
// import "./Saved.css";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useDispatch, useSelector } from "react-redux";
import { likePost, savePost, unSavePost } from "../../Features/PostSlice";

import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
// import "./Saved.css";
import HeaderPost from "../Post/HeaderPost";
import BodyPost from "../Post/BodyPost";
import FooterPost from "../Post/FooterPost";

function Saved({ save }) {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);

  const handleLikePost = () => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    dispatch(likePost({ post_id: save?.post_id, formData }));
  };

  const handleSavePost = () => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    dispatch(savePost({ post_id: save?.post_id, formData }));
  };

  const handleUnsaved = () => {
    dispatch(unSavePost({ user_id: userDetails?.id, post_id: save?.post_id }));
  };

  const actions = [
    {
      id: "comment",
      location: "post",
      to: `/post/${save?.post_id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: save?.comments,
    },
    {
      id: "like",
      location: "post",
      icon: <FavoriteBorderIcon fontSize="small" />,
      count: save?.likes,
      action: () => handleLikePost(),
    },
    {
      id: "bookmark",
      location: "post",
      icon: <BookmarkBorderIcon fontSize="small" />,
      count: save?.saved,
      action: () => handleUnsaved(),
    },
  ];

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      className="post"
      id={`post-bookmarks-${save?.post_id}`}
      // ref={ref}
    >
      <HeaderPost post={save} />
      <BodyPost post={save} />
      <FooterPost actions={actions} />
    </Box>
  );
}

export default Saved;
