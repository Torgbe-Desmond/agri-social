import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddReplyCommentMutation,
  useGetCommentQuery,
  useGetRepliesQuery,
} from "../../Features/commentApi";
import CommentChat from "./commentChat";
import CommentReplyList from "./CommentReplyList";
import ReplyIndicator from "./ReplyIndicator";
import Comment_Header from "./Comment_Header";
import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";
import { Box } from "@mui/material";
import "./CommentReplies.css";
import { useError } from "../Errors/Errors";
import {
  clearComments,
  updateCommentList,
  updateReplyList,
} from "../../Features/CommentSlice";
import { useDispatch, useSelector } from "react-redux";
import ReplySingleComment from "./ReplySingleComment";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";

function CommentReplies() {
  const { comment_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ---- Local state ----
  const [comment, setComment] = useState("");
  const [addLocalComment, setAddLocalComment] = useState([]);
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [media, setMedia] = useState([]);
  const [v_media, setVMedia] = useState([]);
  const [file, setFile] = useState([]);
  const [mediaType, setMediaType] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const { message, setMessage } = useError();
  const [scrolling, setScrolling] = useState(0);
  const [repliesFetchError, setRepliesFetchError] = useState(false);
  const [singleReplyComment, setSingleReplyComment] = useState();
  const [togetherComments, setTogetherComments] = useState([]);

  // ---- Refs ----
  const chatContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);
  const ReplyScrollRef = useRef();
  const itemRef = useRef();
  const lastScrollTop = useRef(0);

  // ---- Redux ----
  const { replies: replyComments } = useSelector((state) => state.comment);

  // ---- Queries ----
  const {
    data,
    isLoading: loadingComment,
    refetch: refetchComment,
    error:singleCommentError
  } = useGetCommentQuery(comment_id, {
    skip: !comment_id,
  });

  console.log("replyComments", replyComments);
  console.log("singleCommentError",singleCommentError)

  const {
    data: repliesData,
    isLoading: commentsLoading,
    refetch: refetchReplies,
    isFetching: isFetchingReplies,
    isError,
    error: commentsError,
  } = useGetRepliesQuery(comment_id, {
    skip: !comment_id,
  });

  // Handle API errors
  useEffect(() => {
    if (isError && commentsError?.data?.detail) {
      setMessage(commentsError.data.detail);
    }
  }, [isError, commentsError, setMessage]);

  // Handle API errors
  useEffect(() => {
    setSingleReplyComment(data);
    return () => setSingleReplyComment();
  }, [data, loadingComment, comment_id]);

  console.log("repliesData", repliesData);

  // useEffect(() => {
  //   dispatch(updateCommentList({ comments: repliesData }));
  // }, [repliesData]);

  // RTK Mutation
  const [addReplyComment, { isLoading: isAddingReply, error }] =
    useAddReplyCommentMutation();

  // Update redux with replies
  useEffect(() => {
    dispatch(
      updateReplyList({
        replies: [...(repliesData?.comments ?? [])],
        singleReply: data,
        parent: comment_id,
      })
    );
  }, [repliesData, dispatch]);

  // Combine server replies + optimistic local replies
  useEffect(() => {
    // Find the group of replies for the current parent
    const currentGroup = replyComments.find((r) => r.parent === comment_id);

    const all = [...(currentGroup?.replies ?? []), ...(addLocalComment ?? [])];

    // Deduplicate by "id"
    const unique = Array.from(new Map(all.map((c) => [c.id, c])).values());

    setTogetherComments(unique);
  }, [replyComments, addLocalComment, comment_id]);

  // ---- Emoji picker ----
  const openEmojiPicker = (e) => setEmojiAnchor(e.currentTarget);
  const closeEmojiPicker = () => setEmojiAnchor(null);
  const onEmojiSelect = (emoji) => setComment((prev) => prev + emoji.native);

  // ---- Video autoplay logic ----
  const onVideoReach = useCallback(() => {
    if (!itemRef.current) return;

    const postElement = itemRef.current;
    const rect = postElement.getBoundingClientRect();

    const visibleHeight =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const clampedHeight = Math.max(0, visibleHeight);
    const percentOfViewport = (clampedHeight / window.innerHeight) * 100;

    const postId = postElement.id?.replace("replies-single-comment-", "");
    const video = postElement.querySelector("video");
    if (!video) return;

    if (percentOfViewport >= 50 || scrolling > 1) {
      console.log(`▶️ Playing video for post ${postId}`);
      video.play().catch((err) => console.warn("Autoplay failed:", err));
    } else {
      console.log(`⏸️ Pausing video for post ${postId}`);
      video.pause();
    }
  }, [scrolling]);

  useEffect(() => {
    onVideoReach();
  }, [scrolling, data, onVideoReach]);

  // ---- Media upload ----
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

  // ---- Add reply ----
  const handleAddComment = async () => {
    if (!comment.trim() || !data) return;

    const formData = new FormData();
    formData.append("content", comment.trim());
    formData.append("post_owner", data.user_id);
    formData.append("post_id", data.post_id);
    if (selectedTags) {
      formData.append("tags", selectedTags.join(","));
    }
    file.forEach((f) => formData.append("files", f));
    if (mediaType === "video") formData.append("has_video", 1);
    if (mediaType === "image") formData.append("has_video", 0);

    try {
      const response = await addReplyComment({
        comment_id: data.id,
        formData,
      }).unwrap();

      setAddLocalComment((prev) => [...prev, response]);
      setComment("");
      refetchReplies();
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Scroll to bottom when replies update
  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [togetherComments]);

  return (
    <Box className="post__comment" ref={ReplyScrollRef}>
      <Comment_Header
        name="Replies"
        systemPrefersDark={false}
        handleGoBack={handleGoBack}
      />

      {/* Main comment */}
      <ReplySingleComment comment={data} ref={itemRef} />

      {/* Indicator if replies exist */}
      {replyComments.length > 0 && <ReplyIndicator />}

      {/* Replies list */}
      <CommentReplyList
        isError={isError}
        scrolling={scrolling}
        isFetchingReplies={isFetchingReplies}
        refetchReplies={refetchComment}
        chatContainerRef={chatContainerRef}
        commentsLoading={commentsLoading}
        commentReplies={togetherComments}
        scrollAnchorRef={scrollAnchorRef}
      />

      {/* Error handling */}
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

      {/* Reply input */}
      <CommentChat
        setFile={setFile}
        media={media}
        file={file}
        setVMedia={setVMedia}
        mediaType={mediaType}
        isAddingComment={isAddingReply}
        setMedia={setMedia}
        message={comment}
        setSelectedTags={setSelectedTags}
        setMessage={setComment}
        v_media={v_media}
        handleMediaUpload={handleMediaUpload}
        handleAddComment={handleAddComment}
        systemPrefersDark={false}
        emojiAnchor={emojiAnchor}
        closeEmojiPicker={closeEmojiPicker}
        onEmojiSelect={onEmojiSelect}
        openEmojiPicker={openEmojiPicker}
      />
    </Box>
  );
}

export default CommentReplies;
