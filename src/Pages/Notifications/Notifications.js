import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Notifications.css";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import {
  clearHasMore,
  clearNotificationData,
  getNofitications,
  readNotification,
  setNotificationOffset,
  updateReadNofitications,
} from "../../Features/notificationSlice";
import Notification from "../../components/Notification/Notification";
import { useSocket } from "../../components/Socket/Socket";
import { setScrolling } from "../../Features/StackSlice";
import Header from "../../components/Header/Header";

function Notifications() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const { userDetails } = useSelector((state) => state.auth);
  const { notifications, hasMore, notificationStatus, notificationOffset } =
    useSelector((state) => state.notification);
  const socket = useSocket();
  const itemRefs = useRef([]);
  const scrollRef = useRef();
  const [notification_ids, setNotification_ids] = useState([]);
  const [scrolling, setScroll] = useState(0);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    dispatch(setScrolling(true));
    return () => dispatch(setScrolling(true));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearHasMore());
      dispatch(clearNotificationData());
    };
  }, []);

  useEffect(() => {
    dispatch(
      getNofitications({
        offset: notificationOffset,
        limit: 10,
      })
    )
      .then(() => {
        isFetchingRef.current = false;
      })
      .catch(() => {
        isFetchingRef.current = false;
      });
  }, [notificationOffset]);

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

    console.log("visibleIds", visibleIds);

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
      const formData = new FormData();
      notification_ids.map((id) => {
        formData.append("notification_id", id);
      });
      if (notification_ids.length > 0) {
        dispatch(readNotification({ formData }));
      }
    }, 3000);

    return () => {
      clearTimeout(delayDebounce);
    };
  }, [scrolling, dispatch, socket]);

  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          isFetchingRef.current = true;
          dispatch(setNotificationOffset());
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const desmond = [{ id: [] }];
  const groupByPost = (notifications) => {
    const groupedMap = {};

    notifications.forEach((notif) => {
      if (notif.entity_type === "post") {
        if (!groupedMap[notif.entity_id]) {
          groupedMap[notif.entity_id] = [];
        }
        groupedMap[notif.entity_id].push(notif);
      }
    });

    const desmond = Object.entries(groupedMap).map(([id, notifs]) => {
      const uniqueActorsMap = new Map();
      notifs.forEach((n) => {
        if (!uniqueActorsMap.has(n.actor_id)) {
          uniqueActorsMap.set(n.actor_id, {
            actor_id: n.actor_id,
            user_image: n.user_image,
            username: n.username,
            is_read: n.is_read,
          });
        }
      });

      return {
        id,
        actors: Array.from(uniqueActorsMap.values()),
        message: notifs[0]?.message,
        images: notifs[0]?.images,
        videos: notifs[0]?.videos,
        type: notifs[0]?.type,
        action_id: notifs[0]?.action_id,
        entity_type: notifs[0]?.entity_type,
        created_at: notifs[0]?.created_at,
      };
    });

    return desmond;
  };

  const grouped = groupByPost(notifications);

  console.log(grouped);

  // const array = [];
  // array.push(grouped);

  // console.log("array", array);

  // // Example: render how many users liked each post
  // Object.entries(grouped).forEach((s) => {
  //   console.log(s);
  // });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Header
      feedRef={scrollRef}
      setScroll={setScroll}
      // status={notificationStatus}
      name={"Notifications"}
      children={
        <Box className="notifications">
          {grouped.map((notification, index) => {
            const isLast = index === grouped.length - 1;
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
      }
    />
  );
}

export default Notifications;
