import React, { forwardRef, useCallback, useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, likePost, savePost } from "../../Features/PostSlice";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { predictImageInPost } from "../../Features/PredictionSlice";
import SuccessMessage from "../SuccessMessage/SuccessMessage";

const Post = forwardRef(({ post }, ref) => {
  const dispatch = useDispatch();
  // const { user_id } = useOutletContext();
  const { userDetails } = useSelector((state) => state.auth);
  const { singlePostStatus } = useSelector((state) => state.post);
  const [successMessage, setSuccessMessage] = useState(null);
  const { imageInPostPrediction, imageInPostPredictionStatus } = useSelector(
    (state) => state.prediction
  );
  // const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let responseText = `The image in the post by ${
      post?.username
    } was predicted as ${
      imageInPostPrediction?.prediction_label
    } with a confidence of ${(imageInPostPrediction?.confidence * 100).toFixed(
      2
    )}%.`;
    console.log("how many times");
    if (imageInPostPredictionStatus === "succeeded") {
      setSuccessMessage(responseText);
    }
    return () => setSuccessMessage(null);
  }, [imageInPostPrediction, imageInPostPredictionStatus]);

  const handleSnackbarClose = () => {
    setSuccessMessage(null);
  };

  const handleLikePost = () => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    formData.append("post_owner", post?.user_id);
    dispatch(likePost({ post_id: post?.post_id, formData }));
  };

  const handleNavigateToProfile = () => {
    navigate(`/user/${post?.user_id}`);
  };

  const handleSavePost = () => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    dispatch(savePost({ post_id: post?.post_id, formData }));
  };

  const handlePostDelete = () => {
    dispatch(deletePost({ post_id: post?.post_id }));
  };

  const handlePredictImageInPost = () => {
    const formData = new FormData();
    formData.append("post_id", post?.post_id);
    dispatch(predictImageInPost({ formData }));
  };

  const renderTags = (tags) => {
    if (!tags) return null;
    const tagsArr = tags.split(",");
    return tagsArr.map((tag, index) => {
      const editedTag = `#${tag}`;
      console.log("editedTag", editedTag);
      return (
        <Typography
          color="primary"
          sx={{ padding: "0px", pr: 0.5 }}
          variant="text"
          key={index}
          className="tag"
        >
          {editedTag}
        </Typography>
      );
    });
  };

  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }

  if (singlePostStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  return (
    <div className="post" id={`post-${post?.post_id}`} ref={ref}>
      <div className="post__avatar">
        <Avatar src={post?.user_image} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3 onClick={handleNavigateToProfile}>
              {post?.username}{" "}
              <span className="post__headerSpecial">
                <span>@{post?.username} </span>
                <span>{timeAgo(new Date(post?.created_at))}</span>
              </span>
            </h3>
            {post?.images ? (
              imageInPostPredictionStatus === "loading" ? (
                <CircularProgress />
              ) : (
                <SmartToyOutlinedIcon
                  onClick={handlePredictImageInPost}
                  cursor="pointer"
                  fontSize="small"
                />
              )
            ) : (
              <div></div>
            )}
          </div>
          <div className="post__headerDescription">
            <p>{post?.content}</p>
          </div>
        </div>
        <div className="post__images">
          {post?.images && (
            <img
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: 12,
              }}
              src={post?.images}
              alt="Post visual"
            />
          )}
          {post?.videos && (
            <video
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: 12,
              }}
              controls
            >
              <source src={post.videos} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {post?.tags && (
          <div className="post_tags"> {renderTags(post?.tags)}</div>
        )}
        <div className="post__footer">
          <StatusIcons
            location={"post"}
            to={`/post/${post?.post_id}`}
            icon={<ChatBubbleOutlineIcon fontSize="small" />}
            count={post?.comments}
          />
          {/* <StatusIcons icon={<RepeatIcon fontSize="small" />} count={10} /> */}
          <StatusIcons
            location={"post"}
            icon={<FavoriteBorderIcon fontSize="small" />}
            count={post?.likes}
            action={handleLikePost}
          />
          <StatusIcons
            location={"post"}
            icon={<BookmarkBorderIcon fontSize="small" />}
            count={post?.saved}
            action={handleSavePost}
          />
        </div>
      </div>
      {post?.images && imageInPostPrediction?.post_id === post?.post_id && (
        <SuccessMessage
          successMessage={successMessage}
          duration={10000}
          handleSnackbarClose={handleSnackbarClose}
        />
      )}
    </div>
  );
});

export default Post;
