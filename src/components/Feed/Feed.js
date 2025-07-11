import React, { useCallback, useEffect, useRef, useState } from "react";
import TweetBox from "../TweetBox/TweetBox";
import Post from "../Post/Post";
import "./Feed.css";
import { clearPostData, getPosts } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, CircularProgress } from "@mui/material";
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
  const [showBottomBar, setShowBottomBar] = useState(false);

  // Fetch posts when page number changes
  useEffect(() => {
    dispatch(getPosts({ user_id, offset: pageNumber, limit: 10 }));
  }, [pageNumber, dispatch, user_id]);

  // Clear posts on unmount
  useEffect(() => {
    return () => {
      dispatch(clearPostData());
      dispatch(setScrolling(false));
    };
  }, [dispatch]);

  // Infinite scroll ref
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

  // Scroll detection for showing/hiding bottom tab
  useEffect(() => {
    const feedNode = feedRef.current;
    if (!feedNode) return;

    const handleScroll = () => {
      const scrollTop = feedNode.scrollTop;
      if (scrollTop < lastScrollTop.current) {
        dispatch(setScrolling(true)); // scrolling down
      } else {
        dispatch(setScrolling(false)); // scrolling up
      }
      lastScrollTop.current = scrollTop;
    };

    feedNode.addEventListener("scroll", handleScroll);
    return () => feedNode.removeEventListener("scroll", handleScroll);
  }, []);

  // console.log("showBottomBar:", showBottomBar);

  return (
    <Box
      className="feed"
      ref={feedRef}
      sx={{ height: "100vh", overflowY: "auto" }}
    >
      <TweetBox />

      {postData?.map((post, index) => {
        const isLast = index === postData.length - 1;
        return (
          <div key={index} ref={isLast ? lastPostRef : null}>
            <Post post={post} />
          </div>
        );
      })}

      {postStatus === "loading" && (
        <p className="circular__progress">
          <CircularProgress fontSize="small" />
        </p>
      )}
    </Box>
  );
}

export default Feed;
