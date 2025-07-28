import React, { forwardRef, useCallback, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  clearActionId,
  deletePost,
  likePost,
  savePost,
  setActionId,
  unSavePost,
} from "../../Features/PostSlice";
import { useLocation, useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ComponentStack from "../HandleStack/HandleStack";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
import "./PostHistoryCard.css";
import BodyPost from "../Post/BodyPost";
import FooterPost from "../Post/FooterPost";
import HeaderPost from "../Post/HeaderPost";

const PostHistoryCard = forwardRef(({ post }, ref) => {
  const dispatch = useDispatch();
  const { user_id } = useOutletContext();
  const { userDetails } = useSelector((state) => state.auth);
  const { postStatus, likeStatus, savedStatus, postDeleteStatus } = useSelector(
    (state) => state.post
  );
  const location = useLocation();
  const reference_id = localStorage.getItem("reference_id");

  const handleLikePost = () => {
    const formData = new FormData();
    formData.append("post_owner", post?.user_id);
    dispatch(setActionId(`like-${post?.post_id}`));
    dispatch(likePost({ post_id: post?.post_id }))
      .unwrap()
      .then(() => {
        dispatch(clearActionId());
      })
      .finally(() => {
        dispatch(clearActionId());
      });
  };

  const handleSavePost = () => {
    const formData = new FormData();
    dispatch(savePost({ post_id: post?.post_id }));
  };

  const handlePostDelete = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("DeletePost", { post_id: post?.post_id });
  };

  const handleUnsaved = () => {
    dispatch(setActionId(`bookmark-${post?.post_id}`));
    dispatch(unSavePost({ post_id: post?.post_id }))
      .unwrap()
      .then(() => {
        dispatch(clearActionId());
      })
      .finally(() => {
        dispatch(clearActionId());
      });
  };

  const actions = [
    {
      id: "comment",
      location: "post",
      to: `${reference_id}/post/${post?.post_id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: post?.comments,
    },
    {
      id: "like",
      location: "post",
      icon: post.liked ? (
        <FavoriteIcon fontSize="small" />
      ) : (
        <ChatBubbleOutlineIcon fontSize="small" />
      ),
      count: post?.likes,
      action: () => handleLikePost(),
      status: likeStatus,
    },
    {
      id: "bookmark",
      location: "post",
      icon: <BookmarkBorderIcon fontSize="small" />,
      count: post?.comments,
      action: () => handleUnsaved(),
      status: savedStatus,
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
      sx={{ border: 1, borderColor: "divider" }}
    >
      <HeaderPost post={post} />
      <BodyPost post={post} />
      <FooterPost actions={actions} />
    </Box>
  );
});

export default PostHistoryCard;
