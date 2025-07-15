import React, { useState } from "react";
import {
  Box,
  Button,
  Avatar,
  TextField,
  Tooltip,
  Autocomplete,
  Chip,
  IconButton,
  Popover,
  CircularProgress,
} from "@mui/material";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";

// import "emoji-mart/css/emoji-mart.css";
import "./TweetBox.css";
import EmojiPickerPopover from "../EmojiPickerPopover/EmojiPickerPopover";

function TweetBox() {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((s) => s.auth);
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const { createPostStatus } = useSelector((state) => state.post);

  // --- State ---
  const [content, setContent] = useState("");
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [media, setMedia] = useState(null);
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const predefinedTags = [];

  // --- Emoji Picker ---
  const openEmojiPicker = (e) => setEmojiAnchor(e.currentTarget);
  const closeEmojiPicker = () => setEmojiAnchor(null);
  const isEmojiOpen = Boolean(emojiAnchor);

  const onEmojiSelect = (emoji) => {
    setContent((prev) => prev + emoji.native);
  };

  // --- Media Upload ---
  const handleMediaUpload = (e, type) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setMedia(reader.result);
      reader.readAsDataURL(f);
      setFile(f);
      setMediaType(type);
    }
  };

  const handleClearMedia = () => {
    setMedia(null);
    setMediaType(null);
    setFile(null);
  };

  // --- Post Handling ---
  const handlePost = () => {
    if (!content.trim() && !media) return;

    const formData = new FormData();
    formData.append("content", content);
    formData.append("user_id", userDetails?.id);
    if (mediaType === "video") {
      formData.append("has_video", 1);
    }
    if (selectedTags.length) formData.append("tags", selectedTags.join(","));
    if (file) formData.append("file", file);

    dispatch(createPost({ formData }));

    setContent("");
    setSelectedTags([]);
    handleClearMedia();
  };

  // --- Tag Input ---
  const handleTagChange = (_, value) => setSelectedTags(value);

  const textFieldTransparentProp = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "transparent",
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent",
      },
    },
  };

  return (
    <Box className={`tweetBox`}>
      {createPostStatus === "loading" && (
        <p className="hover__loading">
          <CircularProgress color="inherit" fontSize="large" />
        </p>
      )}
      <form>
        <Box className="tweetBox__input">
          <Avatar src={userDetails?.user_image} />
          <TextField
            multiline
            rows={2}
            placeholder="What's happening?"
            variant="outlined"
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={openEmojiPicker}>
                  <Tooltip title="Add emoji">
                    <InsertEmoticonIcon />
                  </Tooltip>
                </IconButton>
              ),
            }}
            sx={{
              flexGrow: 1,
              marginLeft: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: "transparent" },
              },
              "& .MuiInputBase-input": {
                color: systemPrefersDark ? "#FFF" : "#000",
              },
            }}
          />
          <EmojiPickerPopover
            anchorEl={emojiAnchor}
            onClose={closeEmojiPicker}
            onEmojiSelect={onEmojiSelect}
          />
        </Box>

        <Box mt={2}>
          <Autocomplete
            multiple
            freeSolo
            options={predefinedTags}
            value={selectedTags}
            onChange={handleTagChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={index}
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                label="Tags"
                {...params}
                variant="outlined"
                placeholder="Add Tags"
                sx={{
                  "& .MuiInputBase-input": { color: "#FFF" },
                }}
              />
            )}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: "transparent" },
              },
              "& .MuiInputBase-input": { color: "#FFF" },
            }}
          />
        </Box>

        <Box className="image__video__container">
          {mediaType === "image" && (
            <img
              src={media}
              alt="Preview"
              style={{ width: "100%", borderRadius: 8 }}
            />
          )}
          {mediaType === "video" && (
            <video
              controls
              src={media}
              style={{ width: "100%", borderRadius: 8 }}
            />
          )}
          {media && (
            <Button
              onClick={handleClearMedia}
              variant="outlined"
              color="error"
              size="small"
              sx={{ mt: 1 }}
            >
              Remove Media
            </Button>
          )}
        </Box>

        <Box className="tweetBox__tweetButton__container">
          <Box className="icon__container">
            <label htmlFor="image-upload">
              <Tooltip title="Add Image">
                <IconButton color="primary" component="span">
                  <InsertPhotoOutlinedIcon />
                </IconButton>
              </Tooltip>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleMediaUpload(e, "image")}
            />

            <label htmlFor="video-upload">
              <IconButton color="primary" component="span">
                <Tooltip title="Add Video">
                  <VideoLibraryIcon />
                </Tooltip>
              </IconButton>
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => handleMediaUpload(e, "video")}
            />
          </Box>

          <Button
            onClick={handlePost}
            className="tweetBox__tweetButton"
            color="primary"
            variant="outlined"
          >
            {createPostStatus === "loading" ? (
              <CircularProgress />
            ) : (
              <div>Post</div>
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default TweetBox;

// "(sqlalchemy.exc.InvalidRequestError) A value is required for bind parameter 'id'
// [SQL:
//             INSERT INTO posts (id, user_id, content)
//             VALUES ($1, $2, $3)
//         ]
// [parameters: [{'user_id': '24debfa6-2367-4bb8-8c4f-9f65d36ddef5', 'content': 'Lets try and see if the post posting is working '}]]
// (Background on this error at: https://sqlalche.me/e/20/cd3x)"
