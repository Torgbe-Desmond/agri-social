import { Box, Typography } from "@mui/material";
import React, { useMemo } from "react";
import ViewOnceMedia from "./ViewOnceMedia";

function ViewOncePost({ post }) {
  const combinedMedia = useMemo(() => {
    const mediaArray = [];
    if (post?.images) {
      mediaArray.push(
        ...post.images.split(",").map((src) => ({
          url: src.trim(),
          type: "image",
        }))
      );
    }
    if (post?.videos) {
      mediaArray.push(
        ...post.videos.split(",").map((src) => ({
          url: src.trim(),
          type: "video",
        }))
      );
    }
    return mediaArray;
  }, [post]);

  const renderTags = (tags) => {
    if (!tags) return null;
    return tags.split(",").map((tag, index) => (
      <Typography
        color="primary"
        sx={{ padding: "0px", pr: 0.5 }}
        variant="body2"
        key={index}
        className="post-tag"
      >
        #{tag.trim()}
      </Typography>
    ));
  };

  return (
    <div className="post-container">
      {/* Post Content */}
      {post?.content && (
        <div className="post-content">
          <p>{post.content}</p>
        </div>
      )}

      {/* Media Section */}
      <div className="post-media-section">
        {/* Tags */}
        {post?.tags && <div className="post-tags">{renderTags(post.tags)}</div>}

        {combinedMedia.length > 0 && (
          <Box className="post-media-wrapper">
            <ViewOnceMedia media={combinedMedia} />
          </Box>
        )}
      </div>
    </div>
  );
}

export default ViewOncePost;
