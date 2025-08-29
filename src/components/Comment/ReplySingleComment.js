import { forwardRef, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RepliesSingleCommentBody from "./RepliesSingleCommentBody";
import RepliesSingleCommentHeader from "./RepliesSingleCommentHeader";
import FooterPost from "../Post/FooterPost";
import "./CommentReplies.css";
import { useLikeCommentMutation } from "../../Features/postApi";

const ReplySingleComment = forwardRef(({ comment }, ref) => {
  const reference_id = localStorage.getItem("reference_id");
  const [likeComment] = useLikeCommentMutation();

  const handleLikeComment = async () => {
    const formData = new FormData();
    formData.append("comment_id", comment?.id);
    formData.append("post_owner", comment.user_id);
    try {
      await likeComment({ comment_id: comment?.id, formData }).unwrap();
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  // const actions = [
  //   {
  //     id: "comment",
  //     location: "comment",
  //     to: `/${reference_id}/replies/${comment?.id}`,
  //     icon: <ChatBubbleOutlineIcon fontSize="small" />,
  //     count: comment?.replies || comment?.comments,
  //   },
  //   {
  //     id: "like",
  //     location: "comment",
  //     icon: comment?.liked ? (
  //       <FavoriteIcon fontSize="small" />
  //     ) : (
  //       <FavoriteBorderIcon fontSize="small" />
  //     ),
  //     count: comment?.likes,
  //     action: handleLikeComment,
  //   },
  // ];

  const actions = useMemo(() => {
    if (!comment) return [];

    const commmentCount = comment?.replies || comment?.comments;

    const baseActions = [
      {
        id: "comment",
        location: "comment",
        to: `/${reference_id}/replies/${comment?.id}`,
        icon: <ChatBubbleOutlineIcon fontSize="small" />,
        count: commmentCount ?? 0,
      },
      {
        id: "like",
        location: "comment",
        icon: comment?.liked ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        ),
        count: comment?.likes ?? 0,
        action: handleLikeComment,
      },
    ];

    return baseActions;
  }, [comment]);

  if (!comment) {
    return (
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: "8px",
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
      className="replies-single-comment"
      id={`replies-single-comment-${comment?.id}`}
      ref={ref}
    >
      <RepliesSingleCommentHeader comment={comment} />
      <RepliesSingleCommentBody comment={comment} />
      <FooterPost actions={actions} />
    </Box>
  );
});

export default ReplySingleComment;
