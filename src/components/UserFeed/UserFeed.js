import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./UserFeed.css";
import { Box } from "@mui/material";
import Post from "../Post/Post";
import Header from "../Header/Header";
import { useOutletContext, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUserPostHistoryQuery,
} from "../../Features/postApi";
import { useConversingMutation } from "../../Features/messageApi";
import { useGetAnotherUserProfileQuery } from "../../Features/userApi";
import UserInfo from "../UserInfo/UserInfo";
import {
  emptyUserPostHistory,
  setUserPostHistoryOffset,
  updateUserPostHistoryList,
} from "../../Features/PostSlice";
import { useError } from "../Errors/Errors";

function UserFeed() {
  const { _user_id } = useParams();
  const { user } = useOutletContext();
  const { message, setMessage } = useError();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [visiblePostId, setVisiblePostId] = useState(null);
  const [conversationId, setConversationId] = useState("");
  const itemRefs = useRef([]);
  const observer = useRef(null);
  const feedRef = useRef(null);

  const dispatch = useDispatch();
  const { userPostHistory, userPostHistoryOffset } = useSelector(
    (state) => state.post
  );

  const {
    data: userDetails,
    isLoading: isUserLoading,
    error: userDetailsError,
  } = useGetAnotherUserProfileQuery(_user_id);

  const {
    data,
    isFetching: isPostLoading,
    error: userPostError,
  } = useGetUserPostHistoryQuery(
    { user_id: userDetails?.id, offset: userPostHistoryOffset, limit: 10 },
    { skip: !userDetails?.id }
  );

  // Handle errors
  useEffect(() => {
    if (userDetailsError?.data?.detail) {
      setMessage(userDetailsError.data.detail);
    }
  }, [userDetailsError, setMessage]);

  useEffect(() => {
    if (userPostError?.data?.detail) {
      setMessage(userPostError.data.detail);
    }
  }, [userPostError, setMessage]);

  // Memoize posts
  const postHistory = useMemo(() => {
    return Array.isArray(data?.posts) ? data.posts : [];
  }, [data]);

  // Update post history list
  useEffect(() => {
    if (postHistory.length > 0) {
      dispatch(updateUserPostHistoryList({ userPostHistory: postHistory }));
    }
  }, [postHistory, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(emptyUserPostHistory());
    };
  }, [dispatch]);

  const hasMore = postHistory?.length > 0;

  // Setup conversation
  const [conversing] = useConversingMutation();

  useEffect(() => {
    const startConversation = async () => {
      if (user?.id && userDetails?.id) {
        const formData = new FormData();
        formData.append("member_ids", user.id);
        formData.append("member_ids", userDetails.id);
        try {
          const response = await conversing({ formData }).unwrap();
          setConversationId(response?.conversation_id || "");
        } catch (err) {
          console.error("Error creating conversation:", err);
        }
      }
    };
    startConversation();
  }, [user?.id, userDetails?.id, conversing]);

  // Infinite scroll observer
  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isPostLoading && hasMore) {
          dispatch(setUserPostHistoryOffset());
        }
      });
      if (node) observer.current.observe(node);
    },
    [dispatch, hasMore, isPostLoading]
  );

  // Search filter
  useEffect(() => {
    if (!userPostHistory) return;
    const search = searchTerm.toLowerCase();
    const result = search
      ? userPostHistory.filter(
          (post) =>
            post.username?.toLowerCase().includes(search) ||
            post.content?.toLowerCase().includes(search)
        )
      : userPostHistory;
    setFilteredData(result);
  }, [searchTerm, userPostHistory]);

  // Media visibility logic
  useEffect(() => {
    itemRefs.current.forEach((el) => {
      el?.classList.remove("visible-post", "visible-post-next");
    });
    handleVideoAutoplay();
    handleImageReveal();
  }, [userPostHistory]);

  const handleVideoAutoplay = () => {
    const visibleItem = itemRefs.current.find((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= window.innerHeight / 10 &&
        rect.bottom <= window.innerHeight
      );
    });

    if (!visibleItem) return;

    const postId = visibleItem.querySelector(".post")?.id?.replace("post-", "");
    if (!postId) return;

    const isVideoPost = userPostHistory.find(
      (p) => p.post_id === postId && p.has_video
    );
    if (!isVideoPost) return;

    if (visiblePostId && visiblePostId !== postId) {
      const prevVideo = document.querySelector(`#post-${visiblePostId} video`);
      if (prevVideo) prevVideo.pause();
    }

    const currentVideo = document.querySelector(`#post-${postId} video`);
    if (currentVideo) {
      currentVideo
        .play()
        .catch((err) =>
          console.warn("Autoplay blocked or failed:", err.message)
        );
    }

    setVisiblePostId(postId);
  };

  const handleImageReveal = () => {
    itemRefs.current.forEach((el) => {
      const rect = el?.getBoundingClientRect();
      if (
        rect?.top >= window.innerHeight / 10 &&
        rect?.bottom <= window.innerHeight
      ) {
        const id = el.querySelector(".post")?.id?.replace("post-", "");
        if (id) {
          const image = document.querySelector(`#post-${id} img`);
          if (image) {
            image.style.display = "flex";
          }
        }
      }
    });
  };

  const reloadAction = () => {
    dispatch(emptyUserPostHistory());
  };

  const userDetailComponent = (
    <UserInfo
      _userDetails={userDetails}
      _conversation_id={conversationId}
      _userDetailsStatus={isUserLoading}
    />
  );

  return (
    <Header
      allowedSearch={true}
      name="User"
      userDetailComponent={userDetailComponent}
      setScroll={() => {}}
      reloadAction={reloadAction}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      feedRef={feedRef}
      children={
        <Box>
          {filteredData?.length === 0 ? (
            <p style={{ padding: "1rem", color: "#555" }}>No posts yet.</p>
          ) : (
            filteredData.map((post, index) => {
              const isLast = index === filteredData.length - 1;
              return (
                <div
                  key={post.post_id ?? `fallback-${index}`}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                    if (isLast) lastPostRef(el);
                  }}
                >
                  <Post post={post} />
                </div>
              );
            })
          )}
        </Box>
      }
    />
  );
}

export default UserFeed;
