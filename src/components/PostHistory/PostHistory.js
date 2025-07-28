import React, { useCallback, useEffect, useRef, useState } from "react";
import "./PostHistory.css";
import { useDispatch, useSelector } from "react-redux";
import { getPostHistory, setPostHistoryOffset } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import PostHistoryCard from "../PostHistoryCard/PostHistoryCard";
import Header from "../Header/Header";

function PostHistory() {
  const { user_id } = useOutletContext();
  const dispatch = useDispatch();
  const feedRef = useRef();
  const itemRefs = useRef([]);
  const observer = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [visiblePostId, setVisiblePostId] = useState(null);
  const [scrolling, setScroll] = useState(0);
  const isFetchingRef = useRef(false);

  const { postHistory, postHistoryStatus, hasMoreUserPost, postHistoryOffset } =
    useSelector((state) => state.post);

  // Fetch post history
  useEffect(() => {
    dispatch(getPostHistory({ offset: postHistoryOffset, limit: 10 }))
      .then(() => {
        isFetchingRef.current = false;
      })
      .catch(() => {
        isFetchingRef.current = false;
      });
  }, [dispatch, postHistoryOffset]);

  // Infinite scroll trigger
  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreUserPost && !isFetchingRef) {
          isFetchingRef.current = true;
          dispatch(setPostHistoryOffset());
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMoreUserPost]
  );

  // Search filter
  useEffect(() => {
    const filtered = searchTerm
      ? postHistory.filter(
          (post) =>
            post.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : postHistory;

    setFilteredData(filtered);
  }, [searchTerm, postHistory]);

  const reloadAction = () => {
    dispatch(getPostHistory({ user_id }));
  };

  // Handle visibility and autoplay on scroll
  useEffect(() => {
    const visibleItems = itemRefs.current.filter((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= window.innerHeight / 10 && rect.bottom <= window.innerHeight
      );
    });

    // Show images
    visibleItems.forEach((el) => {
      const postId = el
        ?.querySelector(".post_history")
        ?.id?.replace("post-history-", "");

      if (!postId) return;

      const imageEl = document.querySelector(`#post-history-${postId} img`);
      if (imageEl) imageEl.style.display = "flex";
    });

    // Autoplay video
    const firstVisible = visibleItems[0];
    const postId = firstVisible
      ?.querySelector(".post_history")
      ?.id?.replace("post-history-", "");

    if (!postId) return;

    const hasVideo = postHistory.find(
      (p) => p.post_id === postId && p.has_video
    );

    if (hasVideo) {
      if (visiblePostId && visiblePostId !== postId) {
        const prevVideo = document.querySelector(
          `#post-history-${visiblePostId} video`
        );
        if (prevVideo) prevVideo.pause();
      }

      const currentVideo = document.querySelector(
        `#post-history-${postId} video`
      );
      if (currentVideo) {
        currentVideo
          .play()
          .catch((err) => console.warn("Autoplay failed:", err));
      }

      setVisiblePostId(postId);
    } else {
      if (visiblePostId) {
        const prevVideo = document.querySelector(
          `#post-history-${visiblePostId} video`
        );
        if (prevVideo) prevVideo.pause();
        setVisiblePostId(null);
      }
    }
  }, [scrolling, postHistory]);

  return (
    <Header
      allowedSearch
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      setScroll={setScroll}
      reloadAction={reloadAction}
      feedRef={feedRef}
    >
      <Box>
        {filteredData.length === 0 ? (
          <p style={{ padding: "1rem", color: "#555" }}>No posts yet.</p>
        ) : (
          filteredData.map((post, index) => {
            const isLast = index === postHistory.length - 1;
            return (
              <div
                key={post.post_id || index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                  if (isLast) lastPostRef(el);
                }}
              >
                <PostHistoryCard post={post} />
              </div>
            );
          })
        )}
        {postHistoryStatus === "loading" && (
          <p className="circular__progress">
            <CircularProgress />
          </p>
        )}
      </Box>
    </Header>
  );
}

export default PostHistory;
