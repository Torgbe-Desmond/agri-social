import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Notifications.css";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { updateNotificationList } from "../../Features/notificationSlice";
import Notification from "../../components/Notification/Notification";
import { useSocket } from "../../components/Socket/Socket";
import { setScrolling } from "../../Features/StackSlice";
import Header from "../../components/Header/Header";
import {
  useGetNotificationsQuery,
  useReadNotificationMutation,
} from "../../Features/notificationApi";
import ErrorInfoAndReload from "../../components/Errors/ErrorInfoAndReload";
import Container from "../../components/Container/Container";
import ContainerSearch from "../../components/Container/ContainerSearch";
import ContainerTitle from "../../components/Container/ContainerTitle";

function Notifications() {
  const [tabIndex, setTabIndex] = useState(0);
  const [offset, setOffset] = useState(1);
  const [notification_ids, setNotification_ids] = useState([]);
  const itemRefs = useRef([]);
  const scrollRef = useRef();
  const observer = useRef();
  const socket = useSocket();
  const dispatch = useDispatch();
  const [scrolling, setScroll] = useState(0);
  const [fetchError, setFetchError] = useState(false);
  const { systemPrefersDark } = useOutletContext();
  const { notifications: notificationData } = useSelector(
    (state) => state.notification
  );

  const { data, isFetching, isSuccess, isLoading, refetch, isError } =
    useGetNotificationsQuery({
      offset,
      limit: 10,
    });

  const [readNotification] = useReadNotificationMutation();

  const notifications = useMemo(() => {
    return Array.isArray(data?.notifications) ? data.notifications : [];
  }, [data]);

  const hasMore = notifications.length > 0;

  useEffect(() => {
    setFetchError(isError);
  }, [isError]);

  useEffect(() => {
    if (notifications?.length > 0) {
      dispatch(updateNotificationList({ notifications }));
    }
  }, [notifications]);

  useEffect(() => {
    const handleScroll = () => {
      setScroll((prev) => prev + 1);
    };

    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", handleScroll);

    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
      setScroll(0);
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
        const formData = new FormData();
        notification_ids.forEach((id) =>
          formData.append("notification_id", id)
        );
        readNotification(formData);
      }
    }, 3000);

    return () => clearTimeout(delayDebounce);
  }, [notification_ids, scrolling, readNotification]);

  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setOffset((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, isFetching, dispatch]
  );

  const groupByPost = (notifications) => {
    if (!Array.isArray(notifications)) {
      console.warn(
        "Expected notifications to be an array, but got:",
        notifications
      );
      return [];
    }

    const groupedMap = {};

    notifications.forEach((notif) => {
      if (notif.entity_type === "post") {
        if (!groupedMap[notif.entity_id]) {
          groupedMap[notif.entity_id] = [];
        }
        groupedMap[notif.entity_id].push(notif);
      }
    });

    return Object.entries(groupedMap).map(([id, notifs]) => {
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
  };

  const grouped = groupByPost(notificationData);

  return (
    <Box ref={scrollRef} className="container">
      <Container>
        <ContainerTitle title={"Notifications"} />
      </Container>

      <Box className="notifications">
        {grouped?.map((notification, index) => {
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
      </Box>

      {isError && (
        <ErrorInfoAndReload
          setFetchError={setFetchError}
          isError={fetchError}
          isLoading={isLoading}
          isFetching={isFetching}
          refetch={refetch}
        />
      )}
    </Box>
  );
}

export default Notifications;
