import React, { forwardRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FooterPost from "../Post/FooterPost";
import CommentHeader from "./CommentHeader";
import CommentBody from "./commentBody";
import { likeComment } from "../../Features/CommentSlice";

const Comment = forwardRef(({ comment, singleCommentStatus }, ref) => {
  const dispatch = useDispatch();
  const reference_id = localStorage.getItem("reference_id");

  const handleLikeComment = () => {
    const formData = new FormData();
    formData.append("comment_id", comment?.id);
    formData.append("post_owner", comment?.user_id);
    dispatch(likeComment({ comment_id: comment?.id, formData }));
  };

  const actions = [
    {
      id: "comment",
      location: "comment",
      to: `/${reference_id}/replies/${comment?.id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: comment?.replies || comment?.comments,
    },
    {
      id: "like",
      location: "comment",
      icon: comment?.liked ? (
        <FavoriteIcon fontSize="small" />
      ) : (
        <FavoriteBorderIcon fontSize="small" />
      ),
      count: comment?.likes,
      action: handleLikeComment,
    },
  ];

  if (singleCommentStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  console.log("comment", comment);

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      className="post"
      id={`post-${comment?.id}`}
      ref={ref}
    >
      <CommentHeader comment={comment} />
      <CommentBody comment={comment} />
      <FooterPost actions={actions} />
    </Box>
  );
});

export default Comment;
