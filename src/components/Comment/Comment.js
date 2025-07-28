import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { predictImageInPost } from "../../Features/PredictionSlice";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FooterPost from "../Post/FooterPost";
import Comment_Header from "./Comment_Header";
import CommentBody from "./commentBody";
import { likeComment } from "../../Features/CommentSlice";
import CommentHeader from "./CommentHeader";

const Comment = forwardRef(({ comment }, ref) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);
  const { singleCommentStatus } = useSelector((state) => state.comment);
  const [successMessage, setSuccessMessage] = useState(null);
  const { imageInPostPrediction, imageInPostPredictionStatus } = useSelector(
    (state) => state.prediction
  );
  // const location = useLocation();
  const navigate = useNavigate();
  const reference_id = localStorage.getItem("reference_id");

  const handleSnackbarClose = () => {
    setSuccessMessage(null);
  };

  const handleLikeComment = () => {
    const formData = new FormData();
    formData.append("comment_id", comment?.id);
    formData.append("post_owner", comment?.user_id);
    dispatch(likeComment({ comment_id: comment?.id, formData }));
  };

  const handleNavigateToProfile = () => {
    navigate(`/user/${comment?.user_id}`);
  };

  // const handleSavePost = () => {
  //   const formData = new FormData();
  //   formData.append("user_id", userDetails?.id);
  //   dispatch(setActionId(`bookmark-${post?.post_id}`));
  //   dispatch(savePost({ post_id: post?.post_id, formData }))
  //     .unwrap()
  //     .then(() => {
  //       dispatch(clearActionId());
  //     })
  //     .finally(() => {
  //       dispatch(clearActionId());
  //     });
  // };

  // const handlePostDelete = () => {
  //   dispatch(deletePost({ post_id: c?.post_id }));
  // };

  // const handlePredictImageInPost = () => {
  //   const formData = new FormData();
  //   formData.append("post_id", post?.post_id);
  //   dispatch(predictImageInPost({ formData }));
  // };

  const actions = [
    {
      id: "comment",
      location: "comment",
      to: `/${reference_id}/replies/${comment?.id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: comment?.replies || comment?.comments,
    },
    {
      id: "like",
      location: "comment",
      icon: <FavoriteBorderIcon fontSize="small" />,
      count: comment?.likes,
      action: () => handleLikeComment(),
    },
    // {
    //   id: "bookmark",
    //   location: "comment",
    //   icon: <BookmarkBorderIcon fontSize="small" />,
    //   count: post?.saved,
    //   action: () => handleSavePost(),
    //   status: savedStatus,
    // },
  ];

  if (singleCommentStatus === "loading") {
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
      id={`post-${comment?.id}`}
      ref={ref}
    >
      {/* <RePosts /> */}
      <CommentHeader comment={comment} />
      <CommentBody comment={comment} />
      <FooterPost actions={actions} />
    </Box>
  );
});

export default Comment;
