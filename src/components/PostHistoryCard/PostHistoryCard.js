import React, { forwardRef } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useLocation } from "react-router-dom";
import ComponentStack from "../HandleStack/HandleStack";
import HeaderPost from "../Post/HeaderPost";
import BodyPost from "../Post/BodyPost";
import FooterPost from "../Post/FooterPost";
import "./PostHistoryCard.css";
import {
  useLikePostMutation,
  useUnSavePostMutation,
} from "../../Features/postApi";

const PostHistoryCard = forwardRef(({ post }, ref) => {
  const dispatch = useDispatch();
  const { user_id, user } = useOutletContext();
  const reference_id = localStorage.getItem("reference_id");
  const [likePost] = useLikePostMutation();
  const [unSavePost] = useUnSavePostMutation();

  const handleLikePost = () => {
    likePost({ post_id: post?.post_id });
  };

  const handleUnsaved = () => {
    unSavePost({ post_id: post?.post_id });
  };

  const handlePostDelete = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("DeletePost", { post_id: post?.post_id });
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
      icon: post?.liked ? (
        <FavoriteIcon fontSize="small" />
      ) : (
        <FavoriteBorderIcon fontSize="small" />
      ),
      count: post?.likes,
      action: handleLikePost,
      status: null,
    },
    {
      id: "bookmark",
      location: "post",
      icon: post.saved ? (
        <BookmarkIcon fontSize="small" />
      ) : (
        <BookmarkBorderIcon fontSize="small" />
      ),
      count: post?.saves,
      action: handleUnsaved,
      status: null,
    },
    {
      id: "deletePost",
      location: "post",
      icon: <DeleteOutlineOutlinedIcon fontSize="small" />,
      action: handlePostDelete,
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
