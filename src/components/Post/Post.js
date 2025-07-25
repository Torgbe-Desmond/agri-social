import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, likePost, savePost } from "../../Features/PostSlice";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { predictImageInPost } from "../../Features/PredictionSlice";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import HeaderPost from "../Post/HeaderPost";
import BodyPost from "./BodyPost";
import FooterPost from "./FooterPost";
import RePosts from "./RePosts";
import GroupPost from "./GroupPost";

const Post = forwardRef(({ post }, ref) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);
  const { singlePostStatus, likeStatus, savedStatus } = useSelector(
    (state) => state.post
  );
  const [successMessage, setSuccessMessage] = useState(null);
  const { imageInPostPrediction, imageInPostPredictionStatus } = useSelector(
    (state) => state.prediction
  );
  // const location = useLocation();
  const navigate = useNavigate();
  const reference_id = localStorage.getItem("reference_id")

  useEffect(() => {
    let responseText = `The image in the post by ${
      post?.username
    } was predicted as ${
      imageInPostPrediction?.prediction_label
    } with a confidence of ${(imageInPostPrediction?.confidence * 100).toFixed(
      2
    )}%.`;
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

  const actions = [
    {
      id: "comment",
      location: "post",
      to: `/${reference_id}/post/${post?.post_id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: post?.replies || post?.comments,
    },
    {
      id: "like",
      location: "post",
      icon: <FavoriteBorderIcon fontSize="small" />,
      count: post?.likes,
      action: () => handleLikePost(),
      status: likeStatus,
    },
    {
      id: "bookmark",
      location: "post",
      icon: <BookmarkBorderIcon fontSize="small" />,
      count: post?.saved,
      action: () => handleSavePost(),
      status: savedStatus,
    },
  ];

  if (singlePostStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  const handleJoin = () => {};

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      className="post"
      id={`post-${post?.post_id}`}
      ref={ref}
    >
      {/* <RePosts /> */}
      <HeaderPost post={post} />
      <BodyPost post={post} />
      <FooterPost actions={actions} post_id={post?.post_id} />
    </Box>
  );
});

export default Post;
