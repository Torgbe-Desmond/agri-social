import React, { useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import { likeComment } from "../../Features/CommentSlice";
import { useDispatch } from "react-redux";
import { Box, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HeaderPost from "../Post/HeaderPost";
import BodyPost from "../Post/BodyPost";
import FooterPost from "../Post/FooterPost";

function Replies({ reply, user_id }) {
  const dispatch = useDispatch();
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const navigate = useNavigate();

  const handleLikeComment = () => {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("comment_id", reply?.id);
    formData.append("post_owner", reply.user_id);
    dispatch(likeComment({ comment_id: reply?.id, formData }));
  };

  console.log("reply", reply);

  const handleNavigateToProfile = () => {
    navigate(`/user/${reply?.user_id}`);
  };

  const actions = [
    {
      id: "comment",
      location: "post",
      to: `/replies/${reply?.id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: reply?.comments,
    },
    {
      id: "like",
      location: "post",
      icon: <FavoriteBorderIcon fontSize="small" />,
      count: reply?.likes,
      action: () => handleLikeComment(),
    },
    // {
    //   id: "bookmark",
    //   location: "post",
    //   icon: <BookmarkBorderIcon fontSize="small" />,
    //   count: save?.saved,
    //   action: () => handleUnsaved(),
    // },
  ];

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      id={`post-${reply?.id}`}
      className="post"
    >
      <HeaderPost post={reply} />
      <BodyPost post={reply} />
      <FooterPost actions={actions} />
    </Box>
  );
}

export default Replies;
