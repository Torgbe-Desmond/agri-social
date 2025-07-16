import React from "react";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { Avatar, CircularProgress } from "@mui/material";

function PostHeader({ post, navigateToProfile, predictionStatus, onPredict, showPredictionIcon }) {
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
    <div className="post__headerText">
      <div className="post__avatar">
        <Avatar src={post?.user_image} />
        <h3 onClick={navigateToProfile}>
          {post?.username}
          <span className="post__headerSpecial">
            <span>@{post?.username} </span>
            <span>{timeAgo(new Date(post?.created_at))}</span>
          </span>
        </h3>
      </div>

      {showPredictionIcon && (
        <div className="post__headerRight">
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
}

export default PostHeader;
