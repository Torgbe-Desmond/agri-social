import React, { forwardRef, useEffect, useState } from "react";
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearActionId,
  deletePost,
  likePost,
  updatePostLike,
  updatePostList,
  updatePostSaved,
  // setActionId,
} from "../../Features/PostSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HeaderPost from "../Post/HeaderPost";
import BodyPost from "./BodyPost";
import FooterPost from "./FooterPost";
import { predictImageInPost } from "../../Features/PredictionSlice";
import {
  useLikePostMutation,
  useSavePostMutation,
} from "../../Features/postApi";
import { usePredictImageInPostMutation } from "../../Features/predictionApi";

const Post = forwardRef(({ post }, ref) => {
  const dispatch = useDispatch();
  const { user } = useOutletContext();
  const { imageInPostPrediction, imageInPostPredictionStatus } = useSelector(
    (state) => state.prediction
  );
  const navigate = useNavigate();
  const reference_id = localStorage.getItem("reference_id");
  const [likePost] = useLikePostMutation();
  const [savePost] = useSavePostMutation();

  console.log("post", post);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (imageInPostPredictionStatus === "succeeded") {
      const responseText = `The image in the post by ${
        post?.username
      } was predicted as ${
        imageInPostPrediction?.prediction_label
      } with a confidence of ${(
        imageInPostPrediction?.confidence * 100
      ).toFixed(2)}%.`;
      setSuccessMessage(responseText);
    }
    return () => setSuccessMessage(null);
  }, [imageInPostPrediction, imageInPostPredictionStatus, post?.username]);

  const handleLikePost = async () => {
    const formData = new FormData();
    formData.append("post_owner", post?.user_id);

    try {
      const payload = await likePost({
        post_id: post?.post_id,
        formData,
      }).unwrap();

      dispatch(updatePostLike(payload));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  async function handleSavePost() {
    const formData = new FormData();
    formData.append("user_id", user?.id);
    const payload = await savePost({
      post_id: post?.post_id,
      formData,
    }).unwrap();
    dispatch(updatePostSaved(payload));
  }

  const handlePostDelete = () => {
    // dispatch(deletePost({ post_id: post?.post_id }));
  };

  const handlePredictImageInPost = () => {
    const formData = new FormData();
    formData.append("post_id", post?.post_id);
    // const [predictImage] = usePredictImageInPostMutation()
    // dispatch(predictImageInPost({ formData }));
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
      icon: post?.saved ? (
        <BookmarkIcon fontSize="small" />
      ) : (
        <BookmarkBorderIcon fontSize="small" />
      ),
      count: post?.saves,
      action: handleSavePost,
    },
  ];

  // if (singlePostStatus === "loading") {
  //   return (
  //     <p className="circular__progress">
  //       <CircularProgress />
  //     </p>
  //   );
  // }

  if (!post) {
    return (
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: "30px",
          p: 2,
          m: 2,
        }}
      >
        Post is currently not available
      </Box>
    );
  }

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      className="post"
      id={`post-${post?.post_id}`}
      ref={ref}
    >
      <HeaderPost post={post} />
      <BodyPost post={post} />
      <FooterPost actions={actions} post_id={post?.post_id} />
    </Box>
  );
});

export default Post;
