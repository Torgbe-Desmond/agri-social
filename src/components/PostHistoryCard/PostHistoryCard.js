import React, { forwardRef, useCallback, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, likePost, savePost } from "../../Features/PostSlice";
import { useLocation, useOutletContext } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ComponentStack from "../HandleStack/HandleStack";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

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

  if (singlePostStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  return (
    <div className="post" ref={ref}>
      <div className="post__avatar">
        <Avatar src={post?.user_image} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {post?.username}{" "}
              <span className="post__headerSpecial">@{post?.username}</span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{post?.content}</p>
          </div>
        </div>
        {post?.images && <img src={post?.images} alt="Post visual" />}
        <div className="post__footer">
          <StatusIcons
            to={`/post/${post?.post_id}`}
            icon={<ChatBubbleOutlineIcon fontSize="small" />}
            count={post?.comments}
          />
          <StatusIcons
            icon={<FavoriteBorderIcon fontSize="small" />}
            count={post?.likes}
            action={handleLikePost}
          />
          <StatusIcons
            icon={<BookmarkBorderIcon fontSize="small" />}
            count={post?.saved}
            action={handleSavePost}
          />
          <StatusIcons
            icon={<DeleteOutlineOutlinedIcon fontSize="small" />}
            action={handlePostDelete}
          />
        </div>
      </div>
    </div>
  );
});

export default PostHistoryCard;
