import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddReplyCommentMutation,
  useGetCommentQuery,
  useGetRepliesQuery,
} from "../../Features/commentApi";
import CommentChat from "./commentChat";
import CommentReplyList from "./CommentReplyList";
import ReplyIndicator from "./ReplyIndicator";
import CommentComponent from "./Comment";
import Comment_Header from "./Comment_Header";
import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";
import { Box, Button, Typography } from "@mui/material";
import "./CommentReplies.css";
import { useError } from "../Errors/Errors";

function CommentReplies() {
  const { comment_id } = useParams();
  const [comment, setComment] = useState("");
  const [addLocalComment, setAddLocalComment] = useState([]);
  const chatContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);
  const navigate = useNavigate();
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [media, setMedia] = useState([]);
  const [v_media, setVMedia] = useState([]);
  const [file, setFile] = useState([]);
  const [mediaType, setMediaType] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const { message, setMessage } = useError();

  // RTK Query hooks
  const {
    data: singleComment,
    isLoading: loadingComment,
    refetch: refetchComment,
  } = useGetCommentQuery(comment_id, {
    skip: !comment_id,
  });

  const {
    data: repliesData,
    isLoading: loadingReplies,
    refetch: refetchReplies,
    isError,
    error: commentsError,
  } = useGetRepliesQuery(comment_id, {
    skip: !comment_id,
  });

  useEffect(() => {
    if (isError && commentsError?.data?.detail) {
      setMessage(commentsError.data.detail);
    }
  }, [isError, commentsError, setMessage]);

  const [addReplyComment, { isLoading: isAddingReply, error }] =
    useAddReplyCommentMutation();

  console.log("error", error);

  // Combine server replies + local optimistic replies
  const togetherComments = [
    ...(repliesData?.comments ?? []),
    ...addLocalComment,
  ];
  const openEmojiPicker = (e) => setEmojiAnchor(e.currentTarget);
  const closeEmojiPicker = () => setEmojiAnchor(null);
  const onEmojiSelect = (emoji) => setComment((prev) => prev + emoji.native);

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
    if (!comment.trim() || !singleComment) return;

    const formData = new FormData();
    formData.append("content", comment.trim());
    formData.append("post_owner", singleComment.user_id);
    formData.append("post_id", singleComment.post_id);
    if (selectedTags) {
      formData.append("tags", selectedTags.join(","));
    }
    file.forEach((file) => formData.append("files", file));
    if (mediaType === "video") formData.append("has_video", 1);
    if (mediaType === "image") formData.append("has_video", 0);

    try {
      const response = await addReplyComment({
        comment_id: singleComment.id,
        formData,
      }).unwrap();

      setAddLocalComment((prev) => [...prev, response]);

      setComment("");
      // Optionally refetch replies to sync with server
      refetchReplies();
    } catch (error) {
      console.error("Failed to add reply:", error);
      // Optionally rollback optimistic UI here
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [togetherComments]);

  return (
    <Box className="post__comment">
      <Comment_Header
        name="Replies"
        systemPrefersDark={false}
        handleGoBack={handleGoBack}
      />

      {loadingComment ? (
        <Typography>Loading comment...</Typography>
      ) : (
        <CommentComponent
          comment={singleComment}
          singleCommentStatus={loadingComment}
        />
      )}

      {isError && <Button onClick={refetchComment}>Reload</Button>}
      <ReplyIndicator />

      <CommentReplyList
        chatContainerRef={chatContainerRef}
        commentReplies={togetherComments}
        scrollAnchorRef={scrollAnchorRef}
      />

      <CommentChat
        setFile={setFile}
        media={media}
        file={file}
        setVMedia={setVMedia}
        mediaType={mediaType}
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

      <EmojiPickerPopover
        anchorEl={emojiAnchor}
        onClose={closeEmojiPicker}
        onEmojiSelect={onEmojiSelect}
      />
    </Box>
  );
}

export default CommentReplies;
