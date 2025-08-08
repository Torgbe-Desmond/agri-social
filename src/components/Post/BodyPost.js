import React from "react";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
import { Box, Typography } from "@mui/material";
import FeedImageCard from "../FeedImageCard/FeedImageCard";

function BodyPost({ post }) {
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
        <div className="post_media">
          {post?.images && <FeedImageCard images={post.images.split(",")} />}

          {post?.videos && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                borderRadius: 4,
                border: 1,
                borderColor: "divider",
              }}
            >
              <FeedVideoCard url={post.videos} />
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}

export default BodyPost;



