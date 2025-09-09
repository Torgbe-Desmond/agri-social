import React from "react";
import { Box, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

const MediaUploader = ({ setMediaList, isLoading }) => {
  const handleMediaUpload = (event, type) => {
    const files = Array.from(event.target.files);
    const newMedia = files.map((file) => ({
      file,
      type,
      preview: URL.createObjectURL(file),
    }));
    setMediaList((prev) => [...prev, ...newMedia]);
  };

  return (
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
        <IconButton disabled={isLoading} component="span" color="primary">
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
        <IconButton disabled={isLoading} component="span" color="primary">
          <VideoLibraryIcon />
        </IconButton>
      </label>
    </Box>
  );
};

export default MediaUploader;
