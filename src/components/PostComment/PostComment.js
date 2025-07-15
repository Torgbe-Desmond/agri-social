import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import {
  addComment,
  clearPost,
  getComments,
  getPost,
} from "../../Features/PostSlice";
import { clearComments, likeComment } from "../../Features/CommentSlice";
import { popComponent } from "../../Features/StackSlice";
import "./PostComment.css";
import Post from "../Post/Post";
import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";
import CommentChat from "../Comment/commentChat";
import CommentReplyList from "../CommentReplies/CommentReplyList";
import ReplyIndicator from "../CommentReplies/ReplyIndicator";
import Comment_Header from "../CommentReplies/Comment_Header";

function PostComment() {
  const { post_id } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [addLocalComment, setAddLocalComment] = useState([]);
  const [data, setData] = useState(null);
  const commentsEndRef = useRef(null);
  const [togetherComments, setTogetherComments] = useState([]);
  const { darkMode, systemPrefersDark } = useOutletContext();
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const chatContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);
  const navigate = useNavigate();

  const { post, singlePostStatus, scrollTo } = useSelector(
    (state) => state.post
  );

  const {
    comments: commentData,
    likeCommentStatus,
    commentStatus,
  } = useSelector((state) => state.comment);

  useEffect(() => {
    if (post_id) {
      dispatch(getPost({ post_id }))
        .unwrap()
        .then(() => {
          if (post_id) {
            dispatch(getComments({ post_id }));
          }
        })
        .catch((error) => {
          // ❌ Failure logic here
          console.error("Failed to save post:", error);
        });
    }
  }, []);

  useEffect(() => {
    // if (post_id) {
    //   dispatch(getComments({ post_id }));
    // }
    return () => {
      dispatch(clearComments());
      dispatch(clearPost());
      setTogetherComments([]);
      setAddLocalComment([]);
    };
  }, [dispatch]);

  useEffect(() => {
    setTogetherComments([...commentData, ...addLocalComment]);
  }, [addLocalComment, commentData]);

  const onEmojiSelect = (emoji) => {
    setComment((prev) => prev + emoji.native);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (scrollAnchorRef.current) {
        scrollAnchorRef.current.scrollIntoView({
          behavior: "smooth",
          ininline: "end",
        });
      }
    }, 10);
  }, [addLocalComment]);

  const handleAddComment = () => {
    if (comment.trim()) {
      const messageData = {
        created_at: new Date().toISOString(),
        content: comment.trim(),
        username: userDetails?.username,
        userId: userDetails?.id,
        user_image: userDetails?.user_image,
        likes: [],
        replies: [],
      };

      const formData = new FormData();
      formData.append("content", comment);
      formData.append("post_owner", post?.user_id);
      formData.append("user_id", userDetails?.id);
      dispatch(addComment({ post_id, formData }));
      setAddLocalComment((prev) => [...prev, messageData]);
      setComment("");
    }
  };

  const openEmojiPicker = (e) => setEmojiAnchor(e.currentTarget);
  const closeEmojiPicker = () => setEmojiAnchor(null);

  const handleClose = () => {
    dispatch(popComponent());
  };

  //   const lastPostRef = useCallback(
  //     (node) => {
  //       if (observer.current) observer.current.disconnect();
  //       observer.current = new IntersectionObserver((entries) => {
  //         if (entries[0].isIntersecting && hasMore) {
  //           setPageNumber((prev) => prev + 1);
  //         }
  //       });
  //       if (node) observer.current.observe(node);
  //     },
  //     [hasMore]
  //   );

  // Scroll to bottom when chatMessages change

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [addLocalComment]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(`post-${scrollTo}`);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });

        el.classList.add("highlight-blink");

        const timeoutId = setTimeout(() => {
          el.classList.remove("highlight-blink");
        }, 2000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [togetherComments, scrollTo]);

  // if (commentStatus === "loading") {
  //   return (
  //     <p className="circular__progress">
  //       <CircularProgress size="small" />
  //     </p>
  //   );
  // }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box className="post__comment">
      <Comment_Header
        systemPrefersDark={systemPrefersDark}
        handleGoBack={handleGoBack}
      />

      <Post post={post} />

      <ReplyIndicator />

      <CommentReplyList
        chatContainerRef={chatContainerRef}
        commentReplies={togetherComments}
        scrollAnchorRef={scrollAnchorRef}
        user_id={userDetails?.id}
      />

      <CommentChat
        message={comment}
        setMessage={setComment}
        handleAddComment={handleAddComment}
        systemPrefersDark={systemPrefersDark}
        emojiAnchor={emojiAnchor}
        closeEmojiPicker={closeEmojiPicker}
        onEmojiSelect={onEmojiSelect}
        openEmojiPicker={openEmojiPicker}
      />

      <EmojiPickerPopover
        anchorEl={emojiAnchor}
        onClose={closeEmojiPicker}
        onEmojiSelect={onEmojiSelect}
      />
    </Box>
  );
}

export default PostComment;
