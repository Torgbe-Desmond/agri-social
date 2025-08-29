import React, { forwardRef } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HeaderPost from "../Post/HeaderPost";
import BodyPost from "../Post/BodyPost";
import FooterPost from "../Post/FooterPost";
import { useLikeCommentMutation } from "../../Features/commentApi";

const Replies = forwardRef(({ reply }, ref) => {
  const navigate = useNavigate();
  const reference_id = localStorage.getItem("reference_id");
  const [likeComment] = useLikeCommentMutation();

  const handleLikeComment = async () => {
    const formData = new FormData();
    formData.append("comment_id", reply?.id);
    formData.append("post_owner", reply.user_id);
    try {
      await likeComment({ comment_id: reply?.id, formData }).unwrap();
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleNavigateToProfile = () => {
    navigate(`/user/${reply?.user_id}`);
  };

  const actions = [
    {
      id: "comment",
      location: "post",
      to: `/${reference_id}/replies/${reply?.id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: reply?.comments || reply?.replies,
    },
    {
      id: "like",
      location: "post",
      icon: reply?.liked ? (
        <FavoriteIcon fontSize="small" />
      ) : (
        <FavoriteBorderIcon fontSize="small" />
      ),
      count: reply?.likes,
      action: handleLikeComment,
    },
  ];

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      id={`comment-single-post-${reply?.id}`}
      className="comment-single-post"
      ref={ref}   // ✅ now works
    >
      <HeaderPost post={reply} />
      <BodyPost post={reply} />
      <FooterPost actions={actions} />
    </Box>
  );
});

export default Replies;
