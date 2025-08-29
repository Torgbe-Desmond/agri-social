import React from "react";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { Avatar, CircularProgress } from "@mui/material";
import './CommentReplies.css'


const RepliesSingleCommentHeader = ({
  comment,
  navigateToProfile,
  predictionStatus,
  onPredict,
  showPredictionIcon,
}) => {
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
    <div className="replies-single-comment-header">
      <div className="replies-single-comment-header-user">
        <Avatar src={comment?.user_image} />
        <h3 onClick={navigateToProfile}>
          {comment?.username}
          <span className="replies-single-comment-header-meta">
            <span className="replies-single-comment-header-username">
              @{comment?.username}
            </span>
            <span className="replies-single-comment-header-time">
              {timeAgo(new Date(comment?.created_at))}
            </span>
          </span>
        </h3>
      </div>

      {showPredictionIcon && (
        <div className="replies-single-comment-header-action">
          {comment?.images ? (
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
  );
};

export default RepliesSingleCommentHeader;
