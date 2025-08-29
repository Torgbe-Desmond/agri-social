import { forwardRef } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  useLikePostMutation,
  useUnSavePostMutation,
} from "../../Features/postApi";
import PostHistoryHeader from "./PostHistoryHeader";
import PostHistoryBody from "./PostHistoryBody";
import FooterPost from "../Post/FooterPost";
import ComponentStack from "../HandleStack/HandleStack";

const PostHistoryCard = forwardRef(({ post }, ref) => {
  const dispatch = useDispatch();
  const reference_id = localStorage.getItem("reference_id");
  const [likePost] = useLikePostMutation();
  const [unSavePost] = useUnSavePostMutation();

  const handleLikePost = () => {
    likePost({ post_id: post?.post_id });
  };

  const handleUnsaved = () => {
    unSavePost({ post_id: post?.post_id });
  };

  const handlePostDelete = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("DeletePost", { post_id: post?.post_id });
  };

  const actions = [
    {
      id: "comment",
      location: "post",
      to: `/${reference_id}/post/${post?.post_id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: post?.comments,
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
      icon: post.saved ? (
        <BookmarkIcon fontSize="small" />
      ) : (
        <BookmarkBorderIcon fontSize="small" />
      ),
      count: post?.saves,
      action: handleUnsaved,
      status: null,
    },
    {
      id: "deletePost",
      location: "post",
      icon: <DeleteOutlineOutlinedIcon fontSize="small" />,
      action: handlePostDelete,
    },
  ];

  return (
    <Box
      className="phd"
      id={`phd-${post?.post_id}`}
      ref={ref}
      sx={{ border: 1, borderColor: "divider" }}
    >
      <PostHistoryHeader post={post} />
      <PostHistoryBody post={post} />
      <FooterPost actions={actions} />
    </Box>
  );
});

export default PostHistoryCard;
