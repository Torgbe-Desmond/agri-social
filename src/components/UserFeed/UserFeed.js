import React, { useEffect, useRef, useState } from "react";
import "./UserFeed.css";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  getPostHistory,
  getUserPostHistory,
} from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Post from "../Post/Post";
import Header from "../Header/Header";
import { setScrolling } from "../../Features/StackSlice";

function UserFeed({ user_id }) {
  const dispatch = useDispatch();
  const postRef = useRef();
  const { userPostHistory, postDeleteStatus, userPostHistoryStatus } =
    useSelector((state) => state.post);
  const [filteredData, setFilteredData] = useState([]);
  const feedRef = useRef(null);
  const lastScrollTop = useRef(0);
  const [scrolling, setScroll] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const itemRefs = useRef([]);
  const [visiblePostId, setVisiblePostId] = useState(null);

  useEffect(() => {
    dispatch(getUserPostHistory({ user_id }));
  }, [dispatch, user_id]);

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

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? userPostHistory?.filter(
          (st) =>
            st.username
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase()) ||
            st.content
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase())
        )
      : userPostHistory;
    setFilteredData(searchedData);
  }, [searchTerm, userPostHistory]);

  const reloadAction = () => {
    dispatch(getPostHistory({ user_id }));
  };

  useEffect(() => {
    const visible = itemRefs.current.find((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= parseInt(window.innerHeight / 10) &&
        rect.bottom <= window.innerHeight
      );
    });

    const visibleItems = itemRefs.current.filter((el) => {
      if (!el) return false;

      const rect = el.getBoundingClientRect();
      return (
        rect.top >= window.innerHeight / 10 && rect.bottom <= window.innerHeight
      );
    });

    visibleItems.unshift();

    visibleItems.forEach((el) => {
      const id = el
        ?.querySelector(".post")
        ?.getAttribute("id")
        ?.replace("post-", "");

      const postEl = document.querySelector(`#post-${id}`);
      // console.log("postEl", postEl);

      if (!id || !postEl) return;

      const hasImage = postEl.querySelector(".post__images .post_media img");
      console.log("hasImage", hasImage);

      // const hasVideo = el.querySelector(`#post-${id} video`);

      postEl.classList.add("visible-post-next");

      if (hasImage) {
        console.log("has image");
        hasImage.style.display = "flex";
      }
    });

    itemRefs.current.forEach((el) => el?.classList.remove("visible-post"));

    const videoIds = userPostHistory
      // .filter((p) => p.has_video)
      .map((p) => p.post_id);

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
        console.log("newVideo", newVideo);

        newVideo.play().catch((err) => {
          console.warn("Autoplay failed:", err);
        });
      }

      const newImage = document.querySelector(`#post-${id} img`);
      console.log("newImage", newImage);
      if (newImage) {
        newImage.style.display = "flex";
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
  }, [scrolling, userPostHistory]);

  if (userPostHistoryStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  console.log("scrolling", scrolling);

  return (
    <Box sx={{ height: "100vh", overflowY: "auto" }} ref={feedRef}>
      {filteredData?.length === 0 ? (
        <p style={{ padding: "1rem", color: "#555" }}>No posts yet.</p>
      ) : (
        filteredData.map((post, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            <Post post={post} />
          </div>
        ))
      )}
    </Box>
  );
}

export default UserFeed;
