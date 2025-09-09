// CommentChat.js
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import {
  searchMentionedGroups,
  searchMentionedUsers,
} from "../../Features/SearchSlice";

import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";
import CommentTagInput from "./CommentTagInput";
import CommentMediaPreview from "./CommentMediaPreview";
import CommentTextInput from "./CommentTextInput";
import CommentActions from "./CommentActions";

const CommentChat = ({
  message,
  setMessage,
  handleAddComment,
  isAddingComment,
  handleMediaUpload,
  setFile,
  file = [],
  emojiAnchor,
  mediaType,
  v_media = [],
  setSelectedTags,
  setVMedia,
  closeEmojiPicker,
  media = [],
  setMedia,
  onEmojiSelect,
  openEmojiPicker,
  selectedTags,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const [mentions, setMentions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [links, setLinks] = useState([]);
  const [mentionedUSers, setMentionedUSers] = useState([]);
  const [mentionedGroups, setMentionedGroups] = useState([]);

  // reset mentioned users on empty input
  useEffect(() => {
    if (message === "") setMentionedUSers([]);
  }, [message]);

  // debounce search for users
  useEffect(() => {
    if (!mentions) return;
    const delayDebounce = setTimeout(() => {
      const formData = new FormData();
      mentions.forEach((m) => formData.append("usernames", m));
      dispatch(searchMentionedUsers({ formData }))
        .unwrap()
        .then((payload) => setMentionedUSers(payload.results));
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [mentions, dispatch]);

  // debounce search for groups
  useEffect(() => {
    if (!groups) return;
    const delayDebounce = setTimeout(() => {
      const formData = new FormData();
      groups.forEach((m) => formData.append("name", m));
      dispatch(searchMentionedGroups({ formData }))
        .unwrap()
        .then((payload) => setMentionedGroups(payload.results));
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [groups, dispatch]);

  const handleContentChange = (e) => {
    const text = e.target.value;
    setMessage(text);

    const foundMentions = text.match(/@\w+/g) || [];
    const foundGroups = text.match(/#\w+/g) || [];
    const foundLinks = text.match(/https?:\/\/[^\s]+/g) || [];

    setMentions(foundMentions.map((m) => m.slice(1)));
    setGroups(foundGroups.map((g) => g.slice(1)));
    setLinks(foundLinks);
  };

  const handleAttachmentClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseAttachmentMenu = () => setAnchorEl(null);

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => handleMediaUpload(e, "image");
    input.click();
    handleCloseAttachmentMenu();
  };

  const handleAddVideo = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (e) => handleMediaUpload(e, "video");
    input.click();
    handleCloseAttachmentMenu();
  };

  const handleCommentSubmit = () => {
    if (!message.trim() && file.length === 0) return;
    handleAddComment();
  };

  return (
    <Box
      sx={{
        p: 1,
        bgcolor: useTheme().palette.background.paper,
        boxShadow: "0px -1px 2px rgba(0, 0, 0, 0.1)",
        display: "grid",
        position: "sticky",
        bottom: 0,
        zIndex: 1200,
        gap: 1,
      }}
    >
      {/* Tags */}
      <Box mt={1} mb={0.5}>
        <CommentTagInput
          {...{
            selectedTags,
            setSelectedTags,
            isAddingComment,
          }}
        />
      </Box>

      {/* Media preview */}
      <CommentMediaPreview
        {...{
          media,
          v_media,
          file,
          setFile,
          setMedia,
          setVMedia,
          users: mentionedUSers,
          groups: mentionedGroups,
          links,
        }}
      />

      {/* Input + actions */}
      <Box sx={{ display: "flex" }}>
        <CommentTextInput
          {...{
            message,
            handleContentChange,
            isAddingComment,
            openEmojiPicker,
            handleAttachmentClick,
            anchorEl,
            attachmentMenuOpen: Boolean(anchorEl),
            handleCloseAttachmentMenu,
            handleAddImage,
            handleAddVideo,
          }}
        />
        <CommentActions {...{ handleCommentSubmit, isAddingComment }} />
        <EmojiPickerPopover
          anchorEl={emojiAnchor}
          onClose={closeEmojiPicker}
          onEmojiSelect={onEmojiSelect}
        />
      </Box>
    </Box>
  );
};

export default CommentChat;
