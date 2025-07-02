import React, { useCallback, useEffect, useRef, useState } from "react";
import TweetBox from "../TweetBox/TweetBox";
import Post from "../Post/Post";
import "./Feed.css";
import FlipMove from "react-flip-move";
import { clearPostData, getPosts } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import { useSocket } from "../Socket/Socket";

function Feed() {
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const { postData, hasMore, postStatus } = useSelector((state) => state.post);
  const [pageNumber, setPageNumber] = useState(1);
  const [tabIndex, setTabIndex] = useState(0);
  const socket = useSocket();
  const { userDetails } = useSelector((state) => state.auth);
  const observer = useRef();
  const dispatch = useDispatch();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    dispatch(getPosts({ user_id, offset: pageNumber, limit: 10 }));
  }, [pageNumber]);

  useEffect(() => {
    return () => dispatch(clearPostData());
  }, []);

  const lasPostRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
          // socket.emit("new_notification", {
          //   user_id: userDetails?.id,
          // });
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <Box className="feed">
      {/* <Box  className="feed__header">
        <h2>Home</h2>
      </Box> */}

      <TweetBox />

      {postData?.map((post, index) => {
        const isLast = index === postData.length - 1;
        return (
          <div key={index} ref={isLast ? lasPostRef : null}>
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
