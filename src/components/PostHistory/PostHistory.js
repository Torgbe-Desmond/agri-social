import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./PostHistory.css";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import PostHistoryCard from "../PostHistoryCard/PostHistoryCard";
import Header from "../Header/Header";
import { useGetPostHistoryQuery } from "../../Features/postApi";
import {
  setPostHistoryOffset,
  updatePostHistoryList,
} from "../../Features/PostSlice";
import { useDispatch, useSelector } from "react-redux";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";

function PostHistory() {
  const { user_id } = useOutletContext();
  const feedRef = useRef();
  const itemRefs = useRef([]);
  const observer = useRef();
  const [scrollingCount, setScroll] = useState(0);
  const [offset, setOffset] = useState(1);
  const [visiblePostId, setVisiblePostId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { postHistory, postHistoryOffset } = useSelector((state) => state.post);

  const { data, isFetching, isLoading, error, refetch } =
    useGetPostHistoryQuery({ offset: postHistoryOffset, limit: 10 });

  const hasMoreUserPost = postHistory.length > 0;

  const postData = useMemo(() => {
    return Array.isArray(data?.posts) ? data.posts : [];
  }, [data]);

  useEffect(() => {
    if (postData?.length > 0) {
      dispatch(updatePostHistoryList({ postData }));
    }
  }, [postData]);

  const reloadAction = () => setOffset(0);

  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreUserPost && !isFetching) {
          // setOffset((prev) => prev + 1);
          dispatch(setPostHistoryOffset());
        }
      });
    }
    return () => observer.current?.disconnect();
  }, [hasMoreUserPost, isFetching]);

  const lastPostRef = useCallback((node) => {
    observer.current?.disconnect();
    node && observer.current?.observe(node);
  }, []);

  useEffect(() => {
    const visibleItems = itemRefs.current.filter(Boolean).filter((el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= window.innerHeight / 10 && rect.bottom <= window.innerHeight
      );
    });

    const postId = visibleItems[0]
      ?.querySelector(".post_history")
      ?.id?.replace("post-history-", "");

    if (postId) {
      const hasVideo = postHistory.some(
        (p) => p.post_id === postId && p.has_video
      );
      if (hasVideo) {
        if (visiblePostId && visiblePostId !== postId) {
          const prevVideo = document.querySelector(
            `#post-history-${visiblePostId} video`
          );
          prevVideo?.pause();
        }
        const current = document.querySelector(`#post-history-${postId} video`);
        current?.play().catch((err) => console.warn("Autoplay failed:", err));
        setVisiblePostId(postId);
      } else if (visiblePostId) {
        const prevVideo = document.querySelector(
          `#post-history-${visiblePostId} video`
        );
        prevVideo?.pause();
        setVisiblePostId(null);
      }
    }
  }, [scrollingCount, postHistory]);

  const filteredData = searchTerm
    ? postHistory.filter(
        (p) =>
          p.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : postHistory;

  return (
    <Header
      allowedSearch
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      setScroll={() => setScroll((s) => s + 1)}
      reloadAction={reloadAction}
      feedRef={feedRef}
    >
      <Box>
        {!isLoading && filteredData.length === 0 ? (
          <p style={{ padding: "1rem", color: "#555" }}>No posts yet.</p>
        ) : (
          filteredData.map((post, index) => {
            const isLast = index === filteredData.length - 1;
            return (
              <div
                key={post.post_id}
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
        <ErrorInfoAndReload
          isLoading={isLoading}
          isFetching={isFetching}
          refetch={refetch}
        />
      </Box>
    </Header>
  );
}

export default PostHistory;
