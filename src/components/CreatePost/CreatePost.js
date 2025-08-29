import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Chip,
  Autocomplete,
  Modal,
  CircularProgress,
  useTheme,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { addNewPost } from "../../Features/PostSlice";
import { useCreatePostMutation } from "../../Features/postApi";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [mediaList, setMediaList] = useState([]); // array of { file, type, preview }
  const [selectedTags, setSelectedTags] = useState([]);
  const dispatch = useDispatch();
  const predefinedTags = [];
  const [createPost, { isLoading, error }] = useCreatePostMutation();

  console.log("error", error);

  const theme = useTheme();

  const handleMediaUpload = (event, type) => {
    const files = Array.from(event.target.files);
    const newMedia = files.map((file) => {
      const preview = URL.createObjectURL(file);
      return { file, type, preview };
    });
    setMediaList((prev) => [...prev, ...newMedia]);
  };

  const handleRemoveMedia = (index) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content && mediaList.length === 0) return;
    const formData = new FormData();
    formData.append("content", content);
    if (selectedTags.length) {
      formData.append("tags", selectedTags.join(","));
    }
    mediaList.forEach((m, idx) => {
      formData.append("files", m.file);
    });

    let has_video = 0;
    mediaList.forEach((m) => {
      if (m.type === "video") has_video = 1;
    });

    formData.append("has_video", has_video);

    const payload = await createPost({ formData }).unwrap();
    dispatch(addNewPost({ payload }));

    setContent("");
    setMediaList([]);
    setSelectedTags([]);
    dispatch(popComponent());
  };

  const handleTagChange = (event, value) => setSelectedTags(value);

  return (
    <Modal open={true} aria-labelledby="modal-modal-title">
      <Card
        sx={{
          maxWidth: 500,
          margin: "auto",
          mt: 4,
          borderRadius: 3,
          p: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create a Post
          </Typography>

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="What's on your mind?"
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: 2,
            }}
          />

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
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Add Tags" />
              )}
            />
          </Box>

          <Box mt={2} display="flex" gap={2}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload"
              type="file"
              multiple
              onChange={(e) => handleMediaUpload(e, "image")}
            />
            <label htmlFor="image-upload">
              <IconButton component="span" color="primary">
                <ImageIcon />
              </IconButton>
            </label>

            <input
              accept="video/*"
              style={{ display: "none" }}
              id="video-upload"
              type="file"
              multiple
              onChange={(e) => handleMediaUpload(e, "video")}
            />
            <label htmlFor="video-upload">
              <IconButton component="span" color="primary">
                <VideoLibraryIcon />
              </IconButton>
            </label>
          </Box>

          {/* Media Grid */}
          {mediaList.length > 0 && (
            <Box
              mt={2}
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(70px, 1fr))"
              gap={1}
            >
              {mediaList.map((m, idx) => (
                <Box key={idx} position="relative">
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: 30,
                      backgroundColor: theme.palette.background.paper,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      zIndex: 1,
                    }}
                    onClick={() => handleRemoveMedia(idx)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  {m.type === "image" ? (
                    <img
                      src={m.preview}
                      alt="Preview"
                      style={{
                        width: "70px",
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    <video
                      src={m.preview}
                      controls
                      style={{
                        width: 70,
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" gap={1} mt={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => dispatch(popComponent())}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handlePost}
              disabled={(!content && mediaList.length === 0) || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Post"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default CreatePost;
