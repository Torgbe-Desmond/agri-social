import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";

import { addNewComment, updatePost } from "../../Features/PostSlice";
import { popComponent } from "../../Features/StackSlice";
import { clearComments, updateCommentList } from "../../Features/CommentSlice";

import {
  useAddCommentMutation,
  useGetCommentsQuery,
  useGetPostQuery,
} from "../../Features/postApi";

import { useError } from "../Errors/Errors";
import CommentSinglePost from "./CommentSinglePost";
import CommentChat from "../Comment/commentChat";
import CommentReplyList from "../Comment/CommentReplyList";
import ReplyIndicator from "../Comment/ReplyIndicator";
import Comment_Header from "../Comment/Comment_Header";
import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";

import "./PostComment.css";
import Success from "../Success/Success";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";

function PostComment() {
  const { post_id } = useParams();
  const dispatch = useDispatch();
  const { darkMode, systemPrefersDark, user } = useOutletContext();
  const navigate = useNavigate();

  // ---- State ----
  const [comment, setComment] = useState("");
  const [addLocalComment, setAddLocalComment] = useState([]);
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState([]);
  const [mediaType, setMediaType] = useState(null);
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [v_media, setVMedia] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const { message, setMessage } = useError();
  const [post, setPost] = useState();
  const [scrolling, setScrolling] = useState(0);
  const [fetchError, setFetchError] = useState(false);
  const [repliesFetchError, setRepliesFetchError] = useState(false);

  // ---- Refs ----
  const postScrollRef = useRef();
  const itemRef = useRef();
  const chatContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);
  const lastScrollTop = useRef(0);

  // ---- Mutations / Queries ----
  const [addCommentMutation, { isLoading: isAddingComment, isSuccess }] =
    useAddCommentMutation();

  const {
    data: postData,
    isLoading: singlePostLoading,
    error,
    isError: singlePostIsError,
    isFetching: singlePostIsFetching,
    refetch: singlePostRefetch,
  } = useGetPostQuery(post_id, { skip: !post_id });

  const {
    data = {},
    isLoading: commentsLoading,
    isError,
    isFetching: isFetchingReplies,
    refetch: refetchReplies,
    error: commentsError,
  } = useGetCommentsQuery(post_id, { skip: !post_id });

  // ---- Derived ----
  const { comments = [] } = data;

  // ---- Effects ----
  useEffect(() => {
    if (postData) {
      dispatch(updatePost({ postData }));
      setPost(postData);
    }
  }, [postData]);

  useEffect(() => {
    if (isError && commentsError?.data?.detail) {
      setMessage(commentsError.data.detail);
    }
  }, [isError, commentsError, setMessage]);

  useEffect(() => {
    setFetchError(singlePostIsError);
  }, [singlePostIsError]);

  useEffect(() => {
    setRepliesFetchError(isError);
  }, [isError]);

  useEffect(() => {
    const node = postScrollRef.current;
    if (!node) return;

    const handleScroll = () => {
      lastScrollTop.current = node.scrollTop;
      setScrolling((prev) => prev + 1);
    };

    node.addEventListener("scroll", handleScroll);
    return () => {
      node.removeEventListener("scroll", handleScroll);
      dispatch(clearComments());
    };
  }, []);

  // ---- Handlers ----
  const onVideoReach = useCallback(() => {
    if (!itemRef.current) return;

    const postElement = itemRef.current;
    const rect = postElement.getBoundingClientRect();

    const visibleHeight =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const clampedHeight = Math.max(0, visibleHeight);
    const percentOfViewport = (clampedHeight / window.innerHeight) * 100;

    const postId = postElement.id?.replace("comment-single-post-", "");
    const video = postElement.querySelector("video");
    if (!video) return;

    if (percentOfViewport >= 50 || scrolling > 1) {
      console.log(`▶️ Playing video for post ${postId}`);
      video.play().catch((err) => console.warn("Autoplay failed:", err));
    } else {
      console.log(`⏸️ Pausing video for post ${postId}`);
      video.pause();
    }
  }, [itemRef]);

  useEffect(() => {
    onVideoReach();
  }, [post, scrolling, singlePostLoading]);

  useEffect(() => {
    setAllComments(comments.length > 0 ? [...comments] : addLocalComment);
    dispatch(updateCommentList({ comments }));
  }, [comments, addLocalComment]);

  const togetherComments = [...(comments ?? [])];

  useEffect(() => {
    // increment scrolling
    setScrolling((prev) => prev + 2);

    // wait 2 seconds before running onVideoReach
    const timer = setTimeout(() => {
      console.log("calling onVideoReach after delay...");
      onVideoReach();
    }, 2000);

    // cleanup
    return () => clearTimeout(timer);
  }, [onVideoReach, post]);

  // ---- Helpers ----
  const buildCommentFormData = () => {
    const formData = new FormData();
    formData.append("content", comment);
    formData.append("post_owner", post?.user_id ?? "");
    file.forEach((f) => formData.append("files", f));
    if (selectedTags.length) {
      formData.append("tags", selectedTags.join(","));
    }
    formData.append("has_video", mediaType === "video" ? 1 : 0);
    return formData;
  };

  const createLocalComment = (payload) => ({
    ...payload,
    likes: payload.likes ?? 0,
    comments: payload.comments ?? 0,
    user_image: payload.user_image ?? user?.user_image,
    username: payload.username ?? user?.username,
  });

  const resetCommentForm = () => {
    setComment("");
    setFile([]);
    setMedia([]);
    setVMedia([]);
    setSelectedTags([]);
  };

  const onEmojiSelect = (emoji) => setComment((prev) => prev + emoji.native);

  const handleMediaUpload = (event, type) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles.length) return;

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
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const payload = await addCommentMutation({
        post_id,
        formData: buildCommentFormData(),
      }).unwrap();

      const newComment = createLocalComment(payload);

      setAddLocalComment((prev) => [...prev, newComment]);
      setPost((prev) =>
        prev && post_id === payload?.post_id
          ? { ...prev, comments: (prev.comments || 0) + 1 }
          : prev
      );
      // dispatch(addNewComment(post_id));
      resetCommentForm();
      refetchReplies();
    } catch (error) {
      console.error("Failed to add comment:", error);
      setMessage(error?.data?.detail || "Failed to add comment");
    }
  };

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isSuccess, addLocalComment]);

  // ---- UI ----
  return (
    <Box className="post__comment" ref={postScrollRef}>
      <Success isSuccess={isSuccess} />
      <Comment_Header
        name="Post"
        systemPrefersDark={systemPrefersDark}
        handleGoBack={() => navigate(-1)}
      />

      <CommentSinglePost ref={itemRef} post={post} />

      {fetchError && (
        <ErrorInfoAndReload
          setFetchError={setFetchError}
          isError={fetchError}
          isLoading={singlePostLoading}
          isFetching={singlePostIsFetching}
          refetch={singlePostRefetch}
        />
      )}

      {allComments.length > 0 && <ReplyIndicator />}

      <CommentReplyList
        scrolling={scrolling}
        isError={isError}
        isFetchingReplies={isFetchingReplies}
        refetchReplies={refetchReplies}
        commentsLoading={commentsLoading}
        chatContainerRef={chatContainerRef}
        commentReplies={allComments}
        scrollAnchorRef={scrollAnchorRef}
      />

      {repliesFetchError ||
        (commentsLoading && (
          <ErrorInfoAndReload
            setFetchError={setRepliesFetchError}
            isError={repliesFetchError}
            isLoading={commentsLoading}
            isFetching={isFetchingReplies}
            refetch={refetchReplies}
          />
        ))}

      <CommentChat
        message={comment}
        setFile={setFile}
        media={media}
        file={file}
        isAddingComment={isAddingComment} 
        setMedia={setMedia}
        v_media={v_media}
        setMessage={setComment}
        mediaType={mediaType}
        setSelectedTags={setSelectedTags}
        setVMedia={setVMedia}
        handleMediaUpload={handleMediaUpload}
        handleAddComment={handleAddComment}
        emojiAnchor={emojiAnchor}
        closeEmojiPicker={() => setEmojiAnchor(null)}
        onEmojiSelect={onEmojiSelect}
        openEmojiPicker={(e) => setEmojiAnchor(e.currentTarget)}
      />

    </Box>
  );
}

export default PostComment;
