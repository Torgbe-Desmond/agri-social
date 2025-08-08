import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { addComment, clearPost, getPost } from "../../Features/PostSlice";
import { clearComments } from "../../Features/CommentSlice";
import { popComponent } from "../../Features/StackSlice";
import "./PostComment.css";
import Post from "../Post/Post";
import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";
import CommentChat from "../Comment/commentChat";
import CommentReplyList from "../Comment/CommentReplyList";
import ReplyIndicator from "../Comment/ReplyIndicator";
import Comment_Header from "../Comment/Comment_Header";
import {
  useAddCommentMutation,
  useGetCommentsQuery,
} from "../../Features/commentApi";
import { useGetPostQuery } from "../../Features/postApi";
import { useError } from "../Errors/Errors";

function PostComment() {
  const { post_id } = useParams();
  const dispatch = useDispatch();
  const { darkMode, systemPrefersDark, user } = useOutletContext();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [addLocalComment, setAddLocalComment] = useState([]);
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState([]);
  const [mediaType, setMediaType] = useState(null);
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const chatContainerRef = useRef(null);
  const [v_media, setVMedia] = useState([]);
  const scrollAnchorRef = useRef(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const { message, setMessage } = useError();

  const [addCommentMutation, { isLoading: isAddingComment }] =
    useAddCommentMutation();
  const { data: post, isLoading: singlePostStatus } = useGetPostQuery(post_id, {
    skip: !post_id,
  });

  // Fetch comments using RTK Query
  const {
    data = {},
    isLoading: commentsLoading,
    isError,
    isFetching: isFetchingReplies,
    refetch: refetchReplies,
    error: commentsError,
  } = useGetCommentsQuery(post_id, {
    skip: !post_id,
  });

  useEffect(() => {
    if (isError && commentsError?.data?.detail) {
      setMessage(commentsError.data.detail);
    }
  }, [isError, commentsError, setMessage]);

  const { comments = [], numb_found = 0 } = data;

  // Combine server comments and local added comments
  useEffect(() => {
    if (comments.length > 0) {
      const togetherComments = [...comments, ...addLocalComment];
      setAllComments((prev) => [...prev, ...togetherComments]);
    }
  }, [comments, addLocalComment]);

  // Scroll to bottom when new local comment added
  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [addLocalComment]);

  const onEmojiSelect = (emoji) => {
    setComment((prev) => prev + emoji.native);
  };

  const handleMediaUpload = (event, type) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "image") {
          setMedia((prev) => [...prev, reader.result]);
        } else {
          setVMedia((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(selectedFiles[0]);
      setFile((prev) => [...prev, selectedFiles[0]]);
      setMediaType(type);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    const formData = new FormData();
    formData.append("content", comment);
    formData.append("post_owner", post?.user_id ?? "");
    file.forEach((file) => formData.append("files", file));
    if (selectedTags) {
      formData.append("tags", selectedTags.join(","));
    }
    if (mediaType === "video") formData.append("has_video", 1);
    if (mediaType === "image") formData.append("has_video", 0);

    try {
      const payload = await addCommentMutation({ post_id, formData }).unwrap();

      const {
        id,
        post_id: payloadPostId,
        user_id,
        videos,
        images,
        content: payloadContent,
        created_at,
      } = payload;

      const newComment = {
        id,
        post_id: payloadPostId,
        user_id,
        content: payloadContent,
        images,
        videos,
        created_at,
        likes: 0,
        user_image: user?.user_image,
        username: user?.username,
      };

      setAddLocalComment((prev) => [...new Set([...prev, newComment])]);
      setComment("");
      setFile([]);
      setMedia([]);
      setVMedia([]);
      setSelectedTags([]);
      // refetchReplies();
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Handle error UI if needed
    }
  };

  const openEmojiPicker = (e) => setEmojiAnchor(e.currentTarget);
  const closeEmojiPicker = () => setEmojiAnchor(null);

  const toggleDrawer = (value) => () => setOpenDrawer(value);

  const handleClose = () => {
    dispatch(popComponent());
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // useEffect(() => {
  //   if (scrollTo) {
  //     const el = document.getElementById(`post-${scrollTo}`);
  //     if (el) {
  //       el.scrollIntoView({
  //         behavior: "smooth",
  //         block: "center",
  //         inline: "nearest",
  //       });
  //       el.classList.add("highlight-blink");
  //       const timeoutId = setTimeout(
  //         () => el.classList.remove("highlight-blink"),
  //         2000
  //       );
  //       return () => clearTimeout(timeoutId);
  //     }
  //   }
  // }, [togetherComments, scrollTo]);

  return (
    <Box className="post__comment">
      <Comment_Header
        name="Post"
        systemPrefersDark={systemPrefersDark}
        handleGoBack={handleGoBack}
      />

      <Post post={post} />

      {allComments.length > 0 && <ReplyIndicator />}

      <CommentReplyList
        isFetchingReplies={isFetchingReplies}
        refetchReplies={refetchReplies}
        commentsLoading={commentsLoading}
        chatContainerRef={chatContainerRef}
        commentReplies={allComments}
        scrollAnchorRef={scrollAnchorRef}
      />

      <CommentChat
        message={comment}
        setFile={setFile}
        media={media}
        file={file}
        setMedia={setMedia}
        v_media={v_media}
        setMessage={setComment}
        mediaType={mediaType}
        setSelectedTags={setSelectedTags}
        setVMedia={setVMedia}
        handleMediaUpload={handleMediaUpload}
        openDrawer={openDrawer}
        handleAddComment={handleAddComment}
        systemPrefersDark={systemPrefersDark}
        emojiAnchor={emojiAnchor}
        closeEmojiPicker={closeEmojiPicker}
        onEmojiSelect={onEmojiSelect}
        openEmojiPicker={openEmojiPicker}
        toggleDrawer={toggleDrawer}
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
