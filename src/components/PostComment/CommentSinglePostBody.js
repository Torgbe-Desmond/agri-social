import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import FeedImageCard from "../FeedImageCard/FeedImageCard";
import "./PostComment.css";

function CommentSinglePostBody({ post }) {
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
        className="comment-single-post-tag"
      >
        #{tag.trim()}
      </Typography>
    ));
  };

  return (
    <div className="comment-single-post-body">
      {/* Post Text Content */}
      {post?.content && (
        <div className="comment-single-post-content">
          <p>{post.content}</p>
        </div>
      )}

      {/* Media + Tags */}
      <div className="comment-single-post-media-section">
        {/* Tags */}
        {post?.tags && (
          <div className="comment-single-post-tags">{renderTags(post.tags)}</div>
        )}

        {/* Images / Videos */}
        {combinedMedia.length > 0 && (
          <Box
            className="comment-single-post-media-wrapper"
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
            }}
          >
            <FeedImageCard media={combinedMedia && combinedMedia} />
          </Box>
        )}
      </div>
    </div>
  );
}

export default CommentSinglePostBody;
