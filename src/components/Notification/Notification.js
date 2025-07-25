import React from "react";
import "./Notification.css";
import { Avatar, Box, Tooltip } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { setPostScrollTo } from "../../Features/PostSlice";
import { setCommentScrollTo } from "../../Features/CommentSlice";
import { useDispatch } from "react-redux";
import FeedVideoCard from "../FeedVideoCard/FeedVideoCard";

function Notification({ notification }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const referenceId = localStorage.getItem("reference_id");
  const { systemPrefersDark } = useOutletContext();

  const handleNavigate = (type, entity_type) => {
    const goPost =
      (type === "comment" && entity_type === "post") ||
      (type === "like" && entity_type === "post");

    const goComment =
      (type === "reply" && entity_type === "comment") ||
      (type === "like" && entity_type === "comment");

    if (goPost) {
      dispatch(setPostScrollTo(notification?.action_id));
      navigate(`/${referenceId}/post/${notification?.id}`);
    }
    if (goComment) {
      dispatch(setCommentScrollTo(notification?.action_id));
      navigate(`/${referenceId}/replies/${notification?.id}`);
    }
  };

  const renderType = (type) => {
    if (type === "like") return "liked";
    if (type === "comment") return "commented";
    if (type === "reply") return "replied";
    return "";
  };

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
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        color: systemPrefersDark ? "#FFF" : "#000",
      }}
      className="notifications-panel"
    >
      <Box className={`notification`} id={`notification-${notification?.id}`}>
        <Box className="notification__avatar">
          {notification?.actors?.map((user, index) => (
            <Box>
              <Tooltip key={user.actor_id} title={user.username}>
                <Avatar
                  alt={user.username}
                  src={user.user_image}
                  sx={{
                    width: 40,
                    height: 40,
                    border: "2px solid white",
                    zIndex: notification.actors.length - index,
                    marginLeft: index === 0 ? 0 : "-10%",
                    transition: "all 0.2s",
                    "&:hover": {
                      zIndex: 1000,
                    },
                  }}
                />
              </Tooltip>
              {/* <strong>{user?.username || "Someone"}</strong> */}
            </Box>
          ))}
        </Box>
        {renderType(notification?.type)} your post.
        <Box
          sx={{
            color: systemPrefersDark ? "#FFF" : "#000",
            cursor: "pointer",
            border: 1,
            borderColor: "divider",
            mt: 1,
          }}
          className="notification__headerDescription"
          onClick={() =>
            handleNavigate(notification?.type, notification?.entity_type)
          }
        >
          <p className="message">{notification?.message}</p>

          {notification?.images && (
            <img
              style={{
                display: "block",
                width: "100%",
                objectFit: "contain",
                borderRadius: 12,
                marginTop: "0.5rem",
              }}
              src={notification?.images}
              alt="notification visual"
            />
          )}

          {notification?.videos && (
            <div
              style={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                borderRadius: 12,
                border: 1,
                borderColor: "divider",
              }}
            >
              <FeedVideoCard url={notification.videos} />
            </div>
          )}
        </Box>
        <span className="time">{timeAgo(notification?.created_at)}</span>
      </Box>
    </Box>
  );
}

export default Notification;
