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
  getComments,
  getPost,
} from "../../Features/PostSlice";
import { clearComments, likeComment } from "../../Features/CommentSlice";
import { popComponent } from "../../Features/StackSlice";
import Replies from "../Replies/Replies";
import "./PostComment.css";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Post from "../Post/Post";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommentTextBox from "../CommentTextBox/CommentTextBox";

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
      <Box
        sx={{ background: systemPrefersDark && "background.paper" }}
        className="post__comment__header"
      >
        <h2>
          <ArrowBackIcon cursor="pointer" onClick={handleGoBack} /> Post
        </h2>
      </Box>
      <Post post={post} />
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", p: 1 }}
        className="post__comment__replies"
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

      {/* <CommentTextBox
        setComment={setComment}
        comment={comment}
        systemPrefersDark={systemPrefersDark}
        handleAddComment={handleAddComment}
        darkMode={darkMode}
        openEmojiPicker={openEmojiPicker}
      /> */}

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

export default PostComment;
