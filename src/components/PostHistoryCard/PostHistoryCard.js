import React, { forwardRef, useCallback, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  likePost,
  savePost,
  unSavePost,
} from "../../Features/PostSlice";
import { useLocation, useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ComponentStack from "../HandleStack/HandleStack";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
import "./PostHistoryCard.css";
import BodyPost from "../Post/BodyPost";
import FooterPost from "../Post/FooterPost";
import HeaderPost from "../Post/HeaderPost";

const PostHistoryCard = forwardRef(({ post }, ref) => {
  const dispatch = useDispatch();
  const { user_id } = useOutletContext();
  const { userDetails } = useSelector((state) => state.auth);
  const { singlePostStatus } = useSelector((state) => state.post);
  const location = useLocation();

  const handleLikePost = () => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    dispatch(likePost({ post_id: post?.post_id, formData }));
  };

  const handleSavePost = () => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    dispatch(savePost({ post_id: post?.post_id, formData }));
  };

  const handlePostDelete = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("DeletePost", { post_id: post?.post_id });
  };

  const handleUnsaved = () => {
    dispatch(unSavePost({ user_id: userDetails?.id, post_id: post?.post_id }));
  };

  if (singlePostStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  const actions = [
    {
      id: "comment",
      location: "post",
      to: `/post/${post?.post_id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: post?.comments,
    },
    {
      id: "like",
      location: "post",
      icon: <FavoriteBorderIcon fontSize="small" />,
      count: post?.likes,
      action: () => handleLikePost(),
    },
    {
      id: "bookmark",
      location: "post",
      icon: <BookmarkBorderIcon fontSize="small" />,
      count: post?.comments,
      action: () => handleUnsaved(),
    },
    {
      id: "deletePost",
      location: "post",
      icon: <DeleteOutlineOutlinedIcon fontSize="small" />,
      action: () => handlePostDelete(),
    },
  ];

  return (
    <Box
      className="post_history"
      id={`post-history-${post?.post_id}`}
      ref={ref}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <HeaderPost post={post} />
      <BodyPost post={post} />
      <FooterPost actions={actions} />
    </Box>
  );
});

export default PostHistoryCard;
