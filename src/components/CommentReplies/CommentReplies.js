import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import {
  addComment,
  clearPost,
  clearPostScrollToId,
  getComments,
  getPost,
} from "../../Features/PostSlice";
import {
  addReplyComment,
  clearComments,
  clearCommentScrollTo,
  getComment,
  likeComment,
} from "../../Features/CommentSlice";
import { popComponent } from "../../Features/StackSlice";
import Replies from "../Replies/Replies";
import "./CommentReplies.css";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Post from "../Post/Post";
import Comment from "../Comment/Comment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import Comment_Header from "./Comment_Header";
import ReplyIndicator from "./ReplyIndicator";
import CommentReplyList from "./CommentReplyList";
import CommentChat from "../Comment/commentChat";

function CommentReplies() {
  const { comment_id } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [addLocalComment, setAddLocalComment] = useState([]);
  const { userDetails } = useSelector((state) => state.auth);
  const commentsEndRef = useRef(null);
  const [togetherComments, setTogetherComments] = useState([]);
  const { darkMode, systemPrefersDark } = useOutletContext();
  const chatContainerRef = useRef(null);
  const [emojiAnchor, setEmojiAnchor] = useState(null);

  const openEmojiPicker = (e) => setEmojiAnchor(e.currentTarget);
  const closeEmojiPicker = () => setEmojiAnchor(null);
  const onEmojiSelect = (emoji) => {
    setComment((prev) => prev + emoji.native);
  };

  const scrollAnchorRef = useRef(null);
  const navigate = useNavigate();

  const {
    comments: commentData,
    likeCommentStatus,
    singleComment,
    singleCommentStatus,
    scrollTo,
    commentStatus,
  } = useSelector((state) => state.comment);

  useEffect(() => {
    if (comment_id) {
      dispatch(getComment({ comment_id }));
      dispatch(getComments({ post_id: comment_id }));
    }
    return () => {
      dispatch(clearComments());
      dispatch(clearPost());
      dispatch(clearCommentScrollTo());
      setTogetherComments([]);
      setAddLocalComment([]);
    };
  }, [dispatch, comment_id]);

  useEffect(() => {
    setTogetherComments([...commentData, ...addLocalComment]);
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [addLocalComment, commentData]);

  const handleLikeComment = (comment_id) => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    dispatch(likeComment({ comment_id, formData }));
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const messageData = {
        created_at: new Date().toISOString(),
        content: comment.trim(),
        username: userDetails?.username,
        userId: userDetails?.id,
        user_image: userDetails?.user_image,
        likes: 0,
        replies: 0,
      };

      const formData = new FormData();
      formData.append("content", comment);
      formData.append("user_id", userDetails?.id);
      formData.append("post_owner", singleComment?.user_id);
      formData.append("id", singleComment?.id);
      formData.append("post_id", singleComment?.post_id);
      dispatch(addReplyComment({ comment_id: singleComment?.id, formData }));
      setAddLocalComment((prev) => [...prev, messageData]);
      setComment("");
    }
  };

  const handleClose = () => {
    dispatch(popComponent());
  };

  const handleGoBack = () => {
    navigate(-1);
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

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
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

    return () => {
      dispatch(clearPostScrollToId());
    };
  }, [togetherComments, scrollTo]);

  return (
    <Box className="comment__replies">
      <Comment_Header
        name="Replies"
        systemPrefersDark={systemPrefersDark}
        handleGoBack={handleGoBack}
      />

      <Post post={singleComment} />

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

export default CommentReplies;
