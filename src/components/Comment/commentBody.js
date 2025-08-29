import React, { useMemo } from "react";
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

  return (
    <div>
      <div className="comment__body">
        <div className="comment__header">
          <div className="comment__headerDescription">
            <p>{comment?.content}</p>
          </div>
        </div>
        <div className="comment__images">
          {comment?.tags && (
            <div className="comment_tags"> {renderTags(comment?.tags)}</div>
          )}

          {comment?.videos && (
            <div
              style={{
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
              }}
            >
              <FeedImageCard media={combinedMedia} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentBody;
