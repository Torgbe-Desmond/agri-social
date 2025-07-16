import React from "react";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
import { Typography } from "@mui/material";

function PostBody({ post }) {

  const renderTags = (tags) => {
    if (!tags) return null;
    const tagsArr = tags.split(",");
    return tagsArr.map((tag, index) => {
      const editedTag = `#${tag}`;
      return (
        <Typography
          color="primary"
          sx={{ padding: "0px", pr: 0.5 }}
          variant="text"
          key={index}
          className="tag"
        >
          {editedTag}
        </Typography>
      );
    });
  };
  return (
    <div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerDescription">
            <p>{post?.content}</p>
          </div>
        </div>
        <div className="post__images">
          <div className="post_media">
            {post?.images && (
              <img
                style={{
                  display: "none",
                  width: "100%",
                  objectFit: "contain",
                  borderRadius: 12,
                }}
                src={post?.images}
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

        {post?.tags && (
          <div className="post_tags"> {renderTags(post?.tags)}</div>
        )}
      </div>
    </div>
  );
}

export default PostBody;
