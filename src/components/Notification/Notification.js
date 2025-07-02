import React from "react";
import "./Notification.css";
import { Avatar, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setPostScrollTo } from "../../Features/PostSlice";
import { useDispatch } from "react-redux";
import { setCommentScrollTo } from "../../Features/CommentSlice";

function Notification({ notification }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = (type, entity_type) => {
    // type on entity_type
    const goPost =
      (type === "comment" && entity_type === "post") ||
      (type === "like" && entity_type === "post");

    const goComment =
      (type === "reply" && entity_type === "comment") ||
      (type === "like" && entity_type === "comment");

    if (goPost) {
      dispatch(setPostScrollTo(notification?.action_id));
      navigate(`/post/${notification?.entity_id}`);
    }
    if (goComment) {
      dispatch(setCommentScrollTo(notification?.action_id));
      navigate(`/replies/${notification?.entity_id}`);
    }
  };

  const renderType = (type) => {
    if (type === "like") {
      return "liked";
    }
    if (type === "comment") {
      return "commented";
    }
    if (type === "reply") {
      return "replied";
    }
  };

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
    <Box>
      <Box class="notifications-panel">
        <Box
          class={`notification ${!notification?.is_read && "unread"}`}
          id={`notification-${notification?.id}`}
        >
          <Box className="notification__avatar">
            <Avatar src={notification?.user_image} />
          </Box>{" "}
          <strong>{notification?.username}</strong>{" "}
          {renderType(notification?.type)} your post.
          <Box
            className="notification__headerDescription"
            onClick={() =>
              handleNavigate(notification?.type, notification?.entity_type)
            }
          >
            <p>{notification?.message}</p>
          </Box>{" "}
          <span class="time">
            {timeAgo(new Date(notification?.created_at))}
          </span>
        </Box>
        {/* 
        <div class="notification unread">
          <strong>Dana</strong> replied to your comment: "<em>Great point!</em>"
          <span class="time">15 mins ago</span>
        </div> */}

        {/* <div class="notification read">
          <strong>Alice</strong> commented on your post.
          <span class="time">Yesterday</span>
        </div> */}
      </Box>
    </Box>
  );
}

export default Notification;
