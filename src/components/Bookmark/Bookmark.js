import React, { forwardRef } from "react";
import { Box } from "@mui/material";
import BookmarkBody from "./BookmarkBody";
import BookmarkFooter from "./BookmarkFooter";
import {
  useLikePostMutation,
  useSavePostMutation,
} from "../../Features/postApi";
import { useDispatch } from "react-redux";
import { updatePostLike, updatePostSaved } from "../../Features/PostSlice";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkHeader from "./BookmarkHeader";

const Bookmark = forwardRef(({ bookmark }, ref) => {
  const dispatch = useDispatch();
  const reference_id = localStorage.getItem("reference_id");
  const [likePost] = useLikePostMutation();
  const [savePost] = useSavePostMutation();

  const handleLikePost = async () => {
    const formData = new FormData();
    formData.append("post_owner", bookmark?.user_id);
    try {
      const payload = await likePost({
        post_id: bookmark?.post_id,
        formData,
      }).unwrap();  
      dispatch(updatePostLike(payload));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  async function handleUnsaved() {
    const payload = await savePost({ post_id: bookmark?.post_id }).unwrap();
    dispatch(updatePostSaved(payload));
  }

  const actions = [
    {
      id: "comment",
      location: "post",
      to: `/${reference_id}/post/${bookmark?.post_id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: bookmark?.comments,
    },
    {
      id: "like",
      location: "post",
      icon: bookmark?.liked ? (
        <FavoriteIcon fontSize="small" />
      ) : (
        <ChatBubbleOutlineIcon fontSize="small" />
      ),
      count: bookmark?.likes,
      action: handleLikePost,
    },
    {
      id: "bookmark",
      location: "post",
      icon: bookmark.saved ? (
        <BookmarkIcon fontSize="small" />
      ) : (
        <BookmarkBorderIcon fontSize="small" />
      ),
      count: bookmark?.saves,
      action: handleUnsaved,
    },
  ];

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      className="bookmark"
      id={`bookmark-${bookmark?.post_id}`}
      ref={ref}  
    >
      <BookmarkHeader bookmark={bookmark} />
      <BookmarkBody bookmark={bookmark} />
      <BookmarkFooter actions={actions} />
    </Box>
  );
});

export default Bookmark;
