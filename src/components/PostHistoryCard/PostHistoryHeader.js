import React from "react";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { Avatar, CircularProgress } from "@mui/material";

const PostHistoryHeader = ({
  post,
  navigateToProfile,
  predictionStatus,
  onPredict,
  showPredictionIcon,
}) => {
  function timeAgo(date) {
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
  }

  return (
    <div className="phd-header">
      <div className="phd-header-user">
        <Avatar src={post?.user_image} />
        <h3 onClick={navigateToProfile}>
          {post?.username}
          <span className="phd-header-meta">
            <span className="phd-header-username">@{post?.username}</span>
            <span className="phd-header-time">
              {timeAgo(new Date(post?.created_at))}
            </span>
          </span>
        </h3>
      </div>

      {showPredictionIcon && (
        <div className="phd-header-action">
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
  );
};

export default PostHistoryHeader;
