import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import FeedImageCard from "../FeedImageCard/FeedImageCard";
import './CommentReplies.css'


const RepliesSingleCommentBody = ({ comment }) => {
  const combinedMedia = useMemo(() => {
    const mediaArray = [];
    if (comment?.images) {
      mediaArray.push(
        ...comment.images.split(",").map((src) => ({
          url: src.trim(),
          type: "image",
        }))
      );
    }
    if (comment?.videos) {
      mediaArray.push(
        ...comment.videos.split(",").map((src) => ({
          url: src.trim(),
          type: "video",
        }))
      );
    }
    return mediaArray;
  }, [comment]);

  const renderTags = (tags) => {
    if (!tags) return null;
    return tags.split(",").map((tag, index) => (
      <Typography
        color="primary"
        sx={{ padding: "0px", pr: 0.5 }}
        variant="body2"
        key={index}
        className="replies-single-comment-tag"
      >
        #{tag.trim()}
      </Typography>
    ));
  };

  return (
    <div className="replies-single-comment-body">
      {/* Comment Text Content */}
      {comment?.content && (
        <div className="replies-single-comment-content">
          <p>{comment.content}</p>
        </div>
      )}

      {/* Media + Tags */}
      <div className="replies-single-comment-media-section">
        {/* Tags */}
        {comment?.tags && (
          <div className="replies-single-comment-tags">
            {renderTags(comment.tags)}
          </div>
        )}

        {/* Images / Videos */}
        {combinedMedia.length > 0 && (
          <Box
            className="replies-single-comment-media-wrapper"
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
};

export default RepliesSingleCommentBody;
