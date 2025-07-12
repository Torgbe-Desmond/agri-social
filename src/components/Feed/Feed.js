import React, { useCallback, useEffect, useRef, useState } from "react";
import Post from "../Post/Post";
import "./Feed.css";
import { clearPostData, getPosts } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import { useSocket } from "../Socket/Socket";
import { setScrolling } from "../../Features/StackSlice";

function Feed() {
  const { user_id } = useOutletContext();
  const { postData, hasMore, postStatus } = useSelector((state) => state.post);
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const socket = useSocket();
  const observer = useRef();

  const feedRef = useRef(null);
  const lastScrollTop = useRef(0);
  const [scrolling, setScroll] = useState(0);

  const itemRefs = useRef([]);
  const [visiblePostId, setVisiblePostId] = useState(null);

  useEffect(() => {
    dispatch(getPosts({ user_id, offset: pageNumber, limit: 10 }));
  }, [pageNumber, dispatch, user_id]);

  useEffect(() => {
    return () => {
      dispatch(clearPostData());
      dispatch(setScrolling(false));
    };
  }, [dispatch]);

  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    const node = feedRef.current;
    if (!node) return;

    const handleScroll = () => {
      const scrollTop = node.scrollTop;
      dispatch(setScrolling(scrollTop > lastScrollTop.current));
      lastScrollTop.current = scrollTop;
      setScroll((prev) => prev + 1);
    };

    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  // Detect visible post
  useEffect(() => {
    const visible = itemRefs.current.find((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= parseInt(window.innerHeight / 50) &&
        rect.bottom <= window.innerHeight
      );
    });

    itemRefs.current.forEach((el) => el?.classList.remove("visible-post"));

    const videoIds = postData.filter((p) => p.has_video).map((p) => p.post_id);

    const id = visible
      ?.querySelector(".post")
      ?.getAttribute("id")
      ?.replace("post-", "");

    if (videoIds.includes(id)) {
      // If new post is different from currently playing
      if (visiblePostId && visiblePostId !== id) {
        // Pause the previously playing video
        const oldVideo = document.querySelector(`#post-${visiblePostId} video`);
        if (oldVideo) oldVideo.pause();
      }

      visible.classList.add("visible-post");

      const newVideo = document.querySelector(`#post-${id} video`);
      if (newVideo) {
        newVideo.play().catch((err) => {
          console.warn("Autoplay failed:", err);
        });
      }

      setVisiblePostId(id); // Update the currently playing video ID
    } else {
      // If visible post is not a video, pause previously playing video
      if (visiblePostId) {
        const prevVideo = document.querySelector(
          `#post-${visiblePostId} video`
        );
        if (prevVideo) prevVideo.pause();
        setVisiblePostId(null);
      }
    }
  }, [scrolling, postData]);

  return (
    <Box
      className="feed"
      ref={feedRef}
      sx={{ height: "100vh", overflowY: "auto", padding: 1 }}
    >
      {postData?.map((post, index) => {
        const isLast = index === postData.length - 1;
        return (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
              if (isLast) lastPostRef(el);
            }}
          >
            <Post post={post} />
          </div>
        );
      })}

      {postStatus === "loading" && (
        <p className="circular__progress">
          <CircularProgress size={20} />
        </p>
      )}
    </Box>
  );
}

export default Feed;
