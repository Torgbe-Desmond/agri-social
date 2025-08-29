import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLikePostMutation,
  useSavePostMutation,
} from "../../Features/postApi";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { updatePostLike, updatePostSaved } from "../../Features/PostSlice";
import Footer from "../Video/Footer";
import { Box } from "@mui/material";

function Image({ url, postId, commentId }) {
  const dispatch = useDispatch();
  const { userDetails: user } = useSelector((state) => state.auth);
  const [media, setMedia] = useState();
  const { posts } = useSelector((state) => state.post);
  const [likePost] = useLikePostMutation();
  const [savePost] = useSavePostMutation();
  const [updatedActions, setUpdatedActions] = useState([]);
  const reference_id = localStorage.getItem("reference_id");
  const { comments, singleComment } = useSelector((state) => state.comment);

  useEffect(() => {
    if (posts?.length > 0 && postId) {
      const post = posts.find((p) => p.post_id === postId);
      setMedia(post);
    }
    if (comments?.length > 0 && commentId) {
      const comment = comments.find((c) => c.id === commentId);
      setMedia(comment);
    }
  }, [posts, postId, commentId, comments]);


  const handleLikePost = async () => {
    const formData = new FormData();
    formData.append("post_owner", postId);

    try {
      const payload = await likePost({
        post_id: postId,
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
      post_id: postId,
      formData,
    }).unwrap();
    dispatch(updatePostSaved(payload));
  }
  const actions = useMemo(() => {
    if (!media) return [];

    const baseActions = [
      {
        id: "comment",
        location: "post",
        to: `/${reference_id}/post/${postId}`,
        icon: <ChatBubbleOutlineIcon fontSize="small" />,
        count: media?.replies ?? media?.comments ?? 0,
      },
      {
        id: "like",
        location: "post",
        icon: media?.liked ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        ),
        count: media?.likes ?? 0,
        action: handleLikePost,
      },
      {
        id: "bookmark",
        location: "post",
        icon: media?.saved ? (
          <BookmarkIcon fontSize="small" />
        ) : (
          <BookmarkBorderIcon fontSize="small" />
        ),
        count: media?.saves ?? 0,
        action: handleSavePost,
      },
    ];

    if (commentId && !postId) {
      return baseActions.filter((a) => a.id !== "bookmark");
    }

    return baseActions;
  }, [media, postId, commentId]);

  return (
    <Box sx={{ display: "grid" }}>
      <img
        src={url}
        alt=""
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
      <Footer actions={actions} />
    </Box>
  );
}

export default Image;
