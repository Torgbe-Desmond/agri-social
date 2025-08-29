import React from "react";
import { Avatar, CircularProgress } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import "./PostComment.css";


function CommentPostHeader({
  post,
  navigateToProfile,
  predictionStatus,
  onPredict,
  showPredictionIcon,
}) {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  return (
    <div className="comment-single-post">
      {/* Header */}
      <div className="comment-single-post-header">
        <div className="comment-single-post-header-user">
          <Avatar src={post?.user_image} />
          <h3 onClick={navigateToProfile}>
            {post?.username}
            <span className="comment-single-post-header-meta">
              <span className="comment-single-post-header-username">
                @{post?.username}
              </span>
              <span className="comment-single-post-header-time">
                {timeAgo(new Date(post?.created_at))}
              </span>
            </span>
          </h3>
        </div>

        {showPredictionIcon && (
          <div className="comment-single-post-header-action">
            {post?.images ? (
              predictionStatus === "loading" ? (
                <CircularProgress size={20} />
              ) : (
                <SmartToyOutlinedIcon
                  onClick={onPredict}
                  cursor="pointer"
                  fontSize="small"
                />
              )
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentPostHeader;
