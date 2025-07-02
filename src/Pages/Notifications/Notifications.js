import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Notifications.css";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import {
  clearHasMore,
  clearNotificationData,
  getNofitications,
  updateReadNofitications,
} from "../../Features/notificationSlice";
import Notification from "../../components/Notification/Notification";
import { useSocket } from "../../components/Socket/Socket";

function Notifications() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const { userDetails } = useSelector((state) => state.auth);
  const { notifications, hasMore, notificationStatus } = useSelector(
    (state) => state.notification
  );
  const socket = useSocket();
  const itemRefs = useRef([]);
  const scrollRef = useRef();
  const [notification_ids, setNotification_ids] = useState([]);
  const [scrolling, setScroll] = useState(0);

  useEffect(() => {
    return () => {
      dispatch(clearHasMore());
      dispatch(clearNotificationData());
    };
  }, []);

  useEffect(() => {
    dispatch(
      getNofitications({
        user_id: userDetails?.id,
        offset: pageNumber,
        limit: 10,
      })
    );
  }, [pageNumber, userDetails?.id]);

  useEffect(() => {
    const handleScroll = () => {
      setScroll((prev) => prev + 1);
      console.log("Container is scrolling...");
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
        setScroll(0);
      }
    };
  }, [scrolling]);

  useEffect(() => {
    const visible = itemRefs.current.filter((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });

    const visibleIds = visible.map((el) =>
      el
        ?.querySelector(".notification.unread")
        ?.getAttribute("id")
        ?.replace("notification-", "")
    );

    if (visibleIds.length > 0) {
      setNotification_ids((prev) => {
        const merged = [...prev.filter(Boolean), ...visibleIds.filter(Boolean)];
        return [...new Set(merged)];
      });
    }
  }, [scrolling, socket]);

  useEffect(() => {
    if (scrolling) return;
    const delayDebounce = setTimeout(() => {
      if (notification_ids.length > 0) {
        if (socket) {
          socket.emit("notification_viewed", {
            notification_ids,
            user_id: userDetails?.id,
          });
        }
      }
    }, 3000);

    return () => {
      clearTimeout(delayDebounce);
    };
  }, [scrolling, dispatch, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleReadNotifications = (data) => {
      dispatch(updateReadNofitications(data));
      setNotification_ids([]);
    };

    socket.on("read_notifications", handleReadNotifications);

    // 🔄 Cleanup on unmount or socket change
    return () => {
      socket.off("read_notifications", handleReadNotifications);
    };
  }, [socket, dispatch]);

  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("logging", hasMore);
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box ref={scrollRef} className="notifications">
      <Box className="notifications__header">
        <h2>Notifications</h2>
      </Box>
      {notifications.map((notification, index) => {
        const isLast = index === notifications.length - 1;
        return (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
              if (isLast) lastPostRef(el);
            }}
          >
            <Notification key={index} notification={notification} />
          </div>
        );
      })}
      {notificationStatus === "loading" && (
        <p className="circular__progress">
          <CircularProgress fontSize="small" />
        </p>
      )}
    </Box>
  );
}

export default Notifications;
