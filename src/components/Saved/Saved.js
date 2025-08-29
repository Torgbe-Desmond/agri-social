import React, { useEffect, useRef } from "react";
// import "./Saved.css";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
// import { likePost, savePost, unSavePost } from "../../Features/PostSlice";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
// import "./Saved.css";
import HeaderPost from "../Post/HeaderPost";
import BodyPost from "../Post/BodyPost";
import FooterPost from "../Post/FooterPost";
import { useOutletContext } from "react-router-dom";
import {
  useLikePostMutation,
  useSavePostMutation,
  useUnSavePostMutation,
} from "../../Features/postApi";
import { updatePostLike, updatePostSaved } from "../../Features/PostSlice";

function Saved({ save }) {
  const dispatch = useDispatch();
  const reference_id = localStorage.getItem("reference_id");
  const { user } = useOutletContext();
  const [likePost] = useLikePostMutation();
  const [savePost] = useSavePostMutation();

  const handleLikePost = async () => {
    const formData = new FormData();
    formData.append("post_owner", save?.user_id);
    try {
      const payload = await likePost({
        post_id: save?.post_id,
        formData,
      }).unwrap();

      dispatch(updatePostLike(payload));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  async function handleUnsaved() {
    const payload = await savePost({
      post_id: save?.post_id,
    }).unwrap();
    dispatch(updatePostSaved(payload));
  }

  const actions = [
    {
      id: "comment",
      location: "post",
      to: `/${reference_id}/post/${save?.post_id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: save?.comments,
    },
    {
      id: "like",
      location: "post",
      icon: save?.liked ? (
        <FavoriteIcon fontSize="small" />
      ) : (
        <ChatBubbleOutlineIcon fontSize="small" />
      ),
      count: save?.likes,
      action: () => handleLikePost(),
    },
    {
      id: "bookmark",
      location: "post",
      icon: save.saved ? (
        <BookmarkIcon fontSize="small" />
      ) : (
        <BookmarkBorderIcon fontSize="small" />
      ),
      count: save?.saves,
      action: () => handleUnsaved(),
    },
  ];

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      className="saved"
      id={`post-bookmarks-${save?.post_id}`}
      // ref={ref}
    >
      <HeaderPost post={save} />
      <BodyPost post={save} />
      <FooterPost actions={actions} />
    </Box>
  );
}

export default Saved;
