import React from "react";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
import { Typography } from "@mui/material";

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
        <div className="post_media">
          {post?.images && (
            <img
              style={{
                display: "none", // This assumes it gets toggled later
                width: "100%",
                objectFit: "contain",
                borderRadius: 12,
              }}
              src={post.images}
              alt="Post visual"
            />
          )}

          {post?.videos && (
            <div
              style={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                borderRadius: 12,
              }}
            >
              <FeedVideoCard url={post.videos} />
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {post?.tags && <div className="post_tags">{renderTags(post.tags)}</div>}
    </div>
  );
}

export default BodyPost;
