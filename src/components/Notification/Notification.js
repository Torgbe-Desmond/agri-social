import React, { useMemo } from "react";
import "./Notification.css";
import { Avatar, Box, Tooltip } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NotificationFooter from "./NotificationFooter";
import ComponentStack from "../HandleStack/HandleStack";
import FeedImageCard from "../FeedImageCard/FeedImageCard";

function Notification({ notification }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const referenceId = localStorage.getItem("reference_id");
  const { systemPrefersDark } = useOutletContext();

  // Navigate to post or comment
  const handleNavigate = (type, entity_type) => {
    const goPost =
      (type === "comment" && entity_type === "post") ||
      (type === "like" && entity_type === "post");

    const goComment =
      (type === "reply" && entity_type === "comment") ||
      (type === "like" && entity_type === "comment");

    if (goPost) {
      navigate(`/${referenceId}/post/${notification?.id}`);
    }
    if (goComment) {
      // Uncomment if you want scroll to comment
      // dispatch(setCommentScrollTo(notification?.action_id));
      navigate(`/${referenceId}/replies/${notification?.id}`);
    }
  };

  // Render action type
  const renderType = (type) => {
    if (type === "like") return "liked";
    if (type === "comment") return "commented";
    if (type === "reply") return "replied";
    return "";
  };

  // Combine images and videos safely
  const combinedMedia = useMemo(() => {
    const mediaArray = [];
    if (notification?.images) {
      mediaArray.push(
        ...notification.images.split(",").map((src) => ({
          url: src.trim(),
          type: "image",
        }))
      );
    }
    if (notification?.videos) {
      mediaArray.push(
        ...notification.videos.split(",").map((src) => ({
          url: src.trim(),
          type: "video",
        }))
      );
    }
    return mediaArray;
  }, [notification?.images, notification?.videos]);

  // Time ago helper
  const timeAgo = (date) => {
    if (!date) return "unknown";
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

  // Delete notification
  const handleDeleteNotification = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("DeleteNotification", {
      notification_id: notification?.id,
    });
  };

  const actions = [
    {
      icon: <DeleteOutlineIcon fontSize="small" />,
      action: handleDeleteNotification,
    },
  ];

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        color: systemPrefersDark ? "#FFF" : "#000",
      }}
      className="notifications-panel"
    >
      <Box className="notification" id={`notification-${notification?.id}`}>
        {/* Avatar Section */}
        <Box className="notification__avatar">
          {notification?.actors?.map((user, index) => (
            <Box key={user.actor_id}>
              <Tooltip title={user.username}>
                <Avatar
                  alt={user.username}
                  src={user.user_image}
                  sx={{
                    width: 40,
                    height: 40,
                    border: "2px solid white",
                    zIndex: (notification.actors?.length || 0) - index,
                    marginLeft: index === 0 ? 0 : "-10%",
                    transition: "all 0.2s",
                    "&:hover": {
                      zIndex: 1000,
                    },
                  }}
                />
              </Tooltip>
            </Box>
          ))}
        </Box>

        {/* Notification Text */}
        {renderType(notification?.type)} your post.

        {/* Media Section */}
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

          {combinedMedia.length > 0 && (
            <Box
              sx={{
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                mt: 1,
              }}
            >
              <FeedImageCard media={combinedMedia} />
            </Box>
          )}
        </Box>

        {/* Time */}
        <span className="time">{timeAgo(notification?.created_at)}</span>
      </Box>

      <NotificationFooter actions={actions} />
    </Box>
  );
}

export default Notification;
