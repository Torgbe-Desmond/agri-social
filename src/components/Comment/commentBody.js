import React from "react";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";
import { Typography } from "@mui/material";
import FeedImageCard from "../FeedImageCard/FeedImageCard";

function CommentBody({ comment }) {
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
      <div className="comment__body">
        <div className="comment__header">
          <div className="comment__headerDescription">
            <p>{comment?.content}</p>
          </div>
        </div>
        <div className="comment__images">
          <div className="post_media">
            {comment?.images && (
              <FeedImageCard images={comment.images.split(",")} />
            )}

            {/* {comment?.images && (
              <img
                style={{
                  display: "none",
                  width: "100%",
                  objectFit: "contain",
                  borderRadius: 12,
                }}
                src={comment?.images}
                alt="Comment visual"
              />
            )} */}

            {comment?.videos && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: 12,
                }}
              >
                <FeedVideoCard url={comment.videos} />
              </div>
            )}
          </div>
        </div>

        {comment?.tags && (
          <div className="comment_tags"> {renderTags(comment?.tags)}</div>
        )}
      </div>
    </div>
  );
}

export default CommentBody;
