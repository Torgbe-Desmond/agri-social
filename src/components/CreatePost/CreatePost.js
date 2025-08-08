import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { addNewPost } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { useCreatePostMutation } from "../../Features/postApi";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const dispatch = useDispatch();
  const predefinedTags = [];
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleMediaUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMedia(reader.result);
      };
      reader.readAsDataURL(file);
      setFile(file);
      setMediaType(type);
    }
  };

  const handleClearMedia = () => {
    setMedia(null);
    setMediaType(null);
  };

  const handlePost = async () => {
    if (!content && !media) return;

    const formData = new FormData();

    formData.append("content", content);
    if (selectedTags) {
      formData.append("tags", selectedTags.join(","));
    }
    if (file) {
      formData.append("file", file);
    }
    if (mediaType === "video") {
      formData.append("has_video", 1);
    }
    if (mediaType === "image") {
      formData.append("has_video", 0);
    }

    const payload = await createPost({ formData }).unwrap();
    dispatch(addNewPost({ payload }));

    setContent("");
    setMedia(null);
    setMediaType(null);
    setSelectedTags([]);
    dispatch(popComponent());
  };

  const handleTagChange = (event, value) => {
    if (event && (event.key === "Enter" || event.key === " ")) {
    }
    setSelectedTags(value);
  };

  const demsond = (
    <Card
      sx={{
        maxWidth: { xs: 400, sm: 400, md: 400, lg: 400 },
        margin: "auto",
        mt: 4,
        borderRadius: "12px",
        p: 2,
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
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={index}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
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
                }}
                variant="outlined"
                label="Tags"
                placeholder="Add Tags"
              />
            )}
          />
        </Box>

        <Box mt={2} display="flex" gap={2} alignItems="center">
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            type="file"
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
            onChange={(e) => handleMediaUpload(e, "video")}
          />
          <label htmlFor="video-upload">
            <IconButton component="span" color="primary">
              <VideoLibraryIcon />
            </IconButton>
          </label>
        </Box>

        {(mediaType === "image" && media) ||
        (mediaType === "video" && media) ? (
          <Box
            mt={2}
            position="relative"
            justifyContent="center"
            display="flex"
            sx={{
              position: "relative",
              display: "inline-block",
              width: 100,
              height: 60,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <IconButton
              size="small"
              color="inherit"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
              }}
              onClick={handleClearMedia}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            {mediaType === "image" ? (
              <img
                src={media}
                style={{ width: "100%", height: "300px", borderRadius: 8 }}
                alt="Preview"
              />
            ) : (
              <video
                controls
                src={media}
                style={{ width: "100%", height: "300px", borderRadius: 8 }}
              />
            )}
          </Box>
        ) : null}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            sx={{
              mt: 2,
              borderRadius: "32px",
              height: "50px",
              marginTop: "20px",
            }}
            fullWidth
            onClick={() => dispatch(popComponent())}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="sidebar__tweet"
            sx={{ mt: 2 }}
            fullWidth
            onClick={handlePost}
            disabled={(!content && !media) || isLoading}
          >
            {isLoading ? (
              <CircularProgress fontSize="small" />
            ) : (
              <span>Post</span>
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {demsond}
      </Modal>
    </div>
  );
};

export default CreatePost;
