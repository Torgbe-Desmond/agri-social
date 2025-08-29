import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import FeedImageCard from "../FeedImageCard/FeedImageCard";

function BodyPost({ post }) {
  const combinedMedia = useMemo(() => {
    const mediaArray = [];
    if (post?.images) {
      mediaArray.push(
        ...post.images.split(",").map((src) => ({
          url: src.trim(),
          post_id: post?.post_id,
          type: "image",
        }))
      );
    }
    if (post?.videos) {
      mediaArray.push(
        ...post.videos.split(",").map((src) => ({
          url: src.trim(),
          post_id: post?.post_id,
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
        className="tag"
      >
        #{tag.trim()}
      </Typography>
    ));
  };

  return (
    <div className="post__body">
      {/* Post Content */}
      {post?.content && (
        <div className="post__headerDescription">
          <p>{post.content}</p>
        </div>
      )}

      {/* Media Section */}
      <div className="post__images">
        {/* Tags */}
        {post?.tags && <div className="post_tags">{renderTags(post.tags)}</div>}

        {combinedMedia.length > 0 && (
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
            }}
          >
            <FeedImageCard media={combinedMedia} />
          </Box>
        )}
      </div>
    </div>
  );
}

export default BodyPost;
