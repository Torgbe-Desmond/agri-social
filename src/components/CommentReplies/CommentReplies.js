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
      <Box
        sx={{
          background: systemPrefersDark && "background.paper",
        }}
        className="comment__replies__header"
      >
        <h2>
          <ArrowBackIcon cursor="pointer" onClick={handleGoBack} /> Replies
        </h2>
      </Box>
      <Comment
        singleComment={singleComment}
        singleCommentStatus={singleCommentStatus}
      />
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", p: 1 }}
        className="comment__replies__replies"
      >
        <h2>
          Replies <KeyboardArrowDownIcon />
        </h2>
      </Box>

      <div ref={chatContainerRef}>
        {togetherComments?.map((reply, index) => (
          <Replies key={index} reply={reply} user_id={userDetails?.id} />
        ))}
        <div ref={scrollAnchorRef} />
      </div>

      <Box
        sx={{
          p: 1,
          bgcolor: systemPrefersDark ? "background.paper" : "#FFF",
          borderTop: 1,
          borderColor: "divider",
        }}
        display="flex"
        position="sticky"
        bottom="0"
        zIndex="100"
        gap={1}
        alignItems="center"
        pt={1}
      >
        <TextField
          sx={{ bgcolor: systemPrefersDark ? "background.paper" : "#FFF" }}
          fullWidth
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          size="small"
          multiline
          minRows={1}
          maxRows={3}
          InputProps={{
            endAdornment: (
              <IconButton onClick={openEmojiPicker}>
                <InsertEmoticonIcon />
              </IconButton>
            ),
          }}
        />

        <IconButton onClick={handleAddComment} disabled={!comment.trim()}>
          <SendIcon />
        </IconButton>
      </Box>

      <EmojiPickerPopover
        anchorEl={emojiAnchor}
        onClose={closeEmojiPicker}
        onEmojiSelect={onEmojiSelect}
      />
    </Box>
  );
}

export default CommentReplies;
