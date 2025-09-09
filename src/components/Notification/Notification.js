import React, { useMemo } from "react";
import "./Notification.css";
import { Avatar, Box, Tooltip } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NotificationFooter from "./NotificationFooter";
import ComponentStack from "../HandleStack/HandleStack";
import FeedImageCard from "../FeedImageCard/FeedImageCard";
import JoinLeftIcon from "@mui/icons-material/JoinLeft";

function Notification({ notification }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const referenceId = localStorage.getItem("reference_id");
  const { systemPrefersDark } = useOutletContext();

  const handleAcceptGroupRequestModal = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("AcceptJoinGroupRequest", {
      groups: notification?.groups,
      mentions: notification?.mentions,
    });
  };

  console.log("notification", notification);

  function things(post) {
    if (!post.message) return null;

    const mentionMap = new Map(
      (post.mentions || []).map((m) => [m.id.toString(), m.username])
    );
    const groupMap = new Map(
      (post.groups || []).map((g) => [g.id.toString(), g.name])
    );

    const urlRegex = /^https?:\/\/[^\s]+$/;
    const tokens = post.message.split(" ");

    return tokens.map((token, idx) => {
      if (mentionMap.has(token)) {
        const username = mentionMap.get(token);
        return (
          <a
            key={idx}
            href={`/${referenceId}/user/${token}`}
            style={{ color: "#1976d2", fontWeight: 600, cursor: "pointer" }}
          >
            @{username}
          </a>
        );
      }
      if (groupMap.has(token)) {
        const groupName = groupMap.get(token);
        return (
          <a
            key={idx}
            onClick={(e) => {
              e.preventDefault();
            }}
            style={{
              textDecoration: "none",
              color: "#1976d2",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ${groupName}
          </a>
        );
      }
      if (urlRegex.test(token)) {
        return (
          <a
            key={idx}
            href={token}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1976d2", fontWeight: 600, cursor: "pointer" }}
          >
            {token}
          </a>
        );
      }
      return <span key={idx}> {token} </span>;
    });
  }

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

  if (notification.entity_type === "group") {
    actions.push({
      icon: <JoinLeftIcon fontSize="small" />,
      action: handleAcceptGroupRequestModal,
    });
  }

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
          <p className="message">{things(notification)}</p>

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
