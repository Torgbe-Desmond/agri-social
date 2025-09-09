import { forwardRef, useState } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeletePostMutation,
  useLikePostMutation,
  useSavePostMutation,
  useUnSavePostMutation,
} from "../../Features/postApi";
import PostHistoryHeader from "./PostHistoryHeader";
import PostHistoryBody from "./PostHistoryBody";
import FooterPost from "../Post/FooterPost";
import ComponentStack from "../HandleStack/HandleStack";
import {
  removeDeletedPost,
  updatePostLike,
  updatePostLikeInHistory,
  updatePostSaved,
  updatePostSavedInHistory,
} from "../../Features/PostSlice";
import { popComponent } from "../../Features/StackSlice";

const PostHistoryCard = forwardRef(({ post }, ref) => {
  const dispatch = useDispatch();
  const reference_id = localStorage.getItem("reference_id");
  const [likePost, { isLoading: isLoadingLiked, isError: isErrorLiked }] =
    useLikePostMutation();
  const [unSavePost] = useUnSavePostMutation();
  const [savePost, { isLoading: isLoadingSaved, isError: isErrorSaved }] =
    useSavePostMutation();
  const [flipped, setFlipped] = useState(false);
  const [deletePost, { isLoading: isLoadingPostDelete }] =
    useDeletePostMutation();

  const handleLikePost = async () => {
    const formData = new FormData();
    formData.append("post_owner", post?.user_id);

    try {
      const payload = await likePost({
        post_id: post?.post_id,
        formData,
      }).unwrap();

      setFlipped(true);

      setTimeout(() => setFlipped(false), 600);
      dispatch(updatePostLikeInHistory(payload));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnsaved = () => {
    unSavePost({ post_id: post?.post_id });
  };

  async function handleSavePost() {
    const payload = await savePost({
      post_id: post?.post_id,
    }).unwrap();
    dispatch(updatePostSavedInHistory(payload));
  }

  const handlePostDelete = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("DeletePost", { post_id: post?.post_id });
  };

  // const renderPostDelete = () => {
  //   const stack = new ComponentStack(dispatch);
  //   stack.handleStack("DeletePost", {
  //     props: {},
  //     open: true,
  //     title: "Confirm",
  //     message: "Are you sure you want to delete this post ?",
  //     onClose: () => dispatch(popComponent()),
  //     actions: [
  //       {
  //         label: "Cancel",
  //         onClick: () => dispatch(popComponent()),
  //         variant: "outlined",
  //         disabled: isLoadingPostDelete,
  //         color: "secondary",
  //       },
  //       {
  //         label: "Delete",
  //         onClick: async () => {
  //           const payload = await deletePost({
  //             post_id: post?.post_id,
  //           }).unwrap();
  //           dispatch(removeDeletedPost({ payload }));
  //           dispatch(popComponent());
  //         },
  //         variant: "contained",
  //         color: "error",
  //         loading: isLoadingPostDelete,
  //       },
  //     ],
  //   });
  // };

  const actions = [
    {
      id: "comment",
      location: "post",
      to: `/${reference_id}/post/${post?.post_id}`,
      icon: <ChatBubbleOutlineIcon fontSize="small" />,
      count: post?.comments,
      status: null,
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
      status: isLoadingLiked,
    },
    // {
    //   id: "bookmark",
    //   location: "post",
    //   icon: post.saved ? (
    //     <BookmarkIcon fontSize="small" />
    //   ) : (
    //     <BookmarkBorderIcon fontSize="small" />
    //   ),
    //   count: post?.saves,
    //   action: handleSavePost,
    //   status: isLoadingSaved,
    // },
    {
      id: "deletePost",
      location: "post",
      icon: <DeleteOutlineOutlinedIcon fontSize="small" />,
      action: handlePostDelete,
      status: null,
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
      <FooterPost
        actions={actions}
        isLoadingSaved={isLoadingSaved}
        isLoadingLiked={isLoadingLiked}
        post_id={post?.post_id}
        flipped={flipped}
      />
    </Box>
  );
});

export default PostHistoryCard;
