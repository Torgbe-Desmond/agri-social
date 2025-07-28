import React, { useCallback, useEffect, useRef, useState } from "react";
import Post from "../Post/Post";
import "./Feed.css";
import { clearPostData, getPosts, setOffset } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import { useSocket } from "../Socket/Socket";
import { setScrolling } from "../../Features/StackSlice";
import TweetBox from "../TweetBox/TweetBox";

function Feed() {
  const { user_id } = useOutletContext();
  const { postData, hasMore, postStatus, offset, aciton_id } = useSelector(
    (state) => state.post
  );
  const dispatch = useDispatch();
  const socket = useSocket();
  const observer = useRef();
  const feedRef = useRef(null);
  const lastScrollTop = useRef(0);
  const [scrolling, setScroll] = useState(0);
  const itemRefs = useRef([]);
  const [visiblePostId, setVisiblePostId] = useState(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    dispatch(getPosts({ offset, limit: 10 }))
      .then(() => {
        isFetchingRef.current = false;
      })
      .catch(() => {
        isFetchingRef.current = false;
      });
  }, [offset, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setScrolling(false));
    };
  }, [dispatch]);

  console.log("Fetching page", offset);

  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isFetchingRef.current) {
          isFetchingRef.current = true;
          dispatch(setOffset());
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
      dispatch(setScrolling(scrollTop < lastScrollTop.current));
      lastScrollTop.current = scrollTop;
      setScroll((prev) => prev + 1);
    };

    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  // Detect visible post
  // Scroll effect to track visible video/image
  useEffect(() => {
    itemRefs.current.forEach((el) => {
      el?.classList.remove("visible-post", "visible-post-next");
    });
    onVideoReach(itemRefs);
    onImageReach(itemRefs);
    onActionsRead(itemRefs);
  }, [scrolling, postData]);

  function onActionsRead(itemRefs) {}

  function onImageReach(itemRefs) {
    const visibleItems = itemRefs.current.filter((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= window.innerHeight / 10 && rect.bottom <= window.innerHeight
      );
    });

    const postIds = visibleItems
      .map((el) =>
        el.querySelector(".post")?.getAttribute("id")?.replace("post-", "")
      )
      .filter(Boolean);

    postIds.forEach((id) => {
      const currentImage = document.querySelector(`#post-${id} img`);
      if (currentImage) {
        currentImage.style.display = "flex";
      }
    });
  }

  function onImageReach(itemRefs) {
    const visibleItems = itemRefs.current.filter((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= window.innerHeight / 10 && rect.bottom <= window.innerHeight
      );
    });

    const postIds = visibleItems
      .map((el) =>
        el.querySelector(".post")?.getAttribute("id")?.replace("post-", "")
      )
      .filter(Boolean);

    postIds.forEach((id) => {
      const currentImage = document.querySelector(`#post-${id} img`);
      if (currentImage) {
        currentImage.style.display = "flex";
      }
    });
  }

  function onVideoReach(itemRefs) {
    const visibleItem = itemRefs.current.find((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= window.innerHeight / 10 && rect.bottom <= window.innerHeight
      );
    });

    if (!visibleItem) return;

    const postId = visibleItem.querySelector(".post")?.id?.replace("post-", "");
    if (!postId) return;

    const isVideoPost = postData.find(
      (p) => p.post_id === postId && p.has_video
    );
    if (!isVideoPost) return;

    // Pause previously playing video
    if (visiblePostId && visiblePostId !== postId) {
      const prev = document.querySelector(`#post-${visiblePostId} video`);
      // const prevFooter = document.querySelector(
      //   `#post-${visiblePostId} .hide-feed-footer-holder`
      // );
      // prevFooter.classList.remove("feed-footer-holder");

      if (prev) prev.pause();
    }

    const currentVideo = document.querySelector(`#post-${postId} video`);

    // const currentFooter = document.querySelector(
    //   `#post-${postId} .hide-feed-footer-holder `
    // );
    if (currentVideo) {
      // currentFooter.classList.add("feed-footer-holder");
      currentVideo.play().catch((err) => console.warn("Autoplay failed:", err));
    }

    setVisiblePostId(postId);
  }

  return (
    <Box
      className="feed"
      ref={feedRef}
      sx={{
        height: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        // justifyContent:"flex-end"
      }}
    >
      {/* <TweetBox /> */}
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
          <CircularProgress fontSize="large" />
        </p>
      )}
    </Box>
  );
}

export default Feed;
