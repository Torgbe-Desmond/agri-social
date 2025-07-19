import React, { useEffect, useRef, useState } from "react";
import "./PostHistory.css";
import { useDispatch, useSelector } from "react-redux";
import { getPostHistory } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress, TextField } from "@mui/material";
import PostHistoryCard from "../PostHistoryCard/PostHistoryCard";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../Header/Header";
import { setScrolling } from "../../Features/StackSlice";
// import './PostHistory.css'

function PostHistory() {
  const { user_id } = useOutletContext();
  const dispatch = useDispatch();
  const postRef = useRef();
  const { postHistory, postHistoryStatus } = useSelector((state) => state.post);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const feedRef = useRef(null);
  const lastScrollTop = useRef(0);
  const [scrolling, setScroll] = useState(0);

  const itemRefs = useRef([]);
  const [visiblePostId, setVisiblePostId] = useState(null);

  useEffect(() => {
    dispatch(getPostHistory({ user_id }));
  }, [dispatch, user_id]);

  // useEffect(() => {
  //   const node = feedRef.current;
  //   if (!node) return;

  //   const handleScroll = () => {
  //     const scrollTop = node.scrollTop;
  //     dispatch(setScrolling(scrollTop > lastScrollTop.current));
  //     lastScrollTop.current = scrollTop;
  //     setScroll((prev) => prev + 1);
  //     console.log("eeee");
  //   };

  //   node.addEventListener("scroll", handleScroll);
  //   return () => node.removeEventListener("scroll", handleScroll);
  // }, [dispatch]);

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? postHistory?.filter(
          (st) =>
            st.username
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase()) ||
            st.content
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase())
        )
      : postHistory;
    setFilteredData(searchedData);
  }, [searchTerm, postHistory]);

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
        ?.querySelector(".post_history")
        ?.getAttribute("id")
        ?.replace("post-history-", "");

      const postEl = document.querySelector(`#post-history-${id}`);
      console.log("postEl", postEl);

      if (!id || !postEl) return;

      const hasImage = postEl.querySelector(".post__images .post_media img");
      console.log("hasImage", hasImage);

      // const hasVideo = el.querySelector(`#post-${id} video`);

      // postEl.classList.add("visible-post-next");

      if (hasImage) {
        console.log("has image");
        hasImage.style.display = "flex";
      }
    });

    // itemRefs.current.forEach((el) => el?.classList.remove("visible-post"));

    const videoIds = postHistory
      // .filter((p) => p.has_video)
      .map((p) => p.post_id);

    const id = visible
      ?.querySelector(".post_history")
      ?.getAttribute("id")
      ?.replace("post-history-", "");

    if (videoIds.includes(id)) {
      // If new post is different from currently playing
      if (visiblePostId && visiblePostId !== id) {
        // Pause the previously playing video
        const oldVideo = document.querySelector(`#post-history-${visiblePostId} video`);
        if (oldVideo) oldVideo.pause();
      }

      // visible.classList.add("visible-post");

      const newVideo = document.querySelector(`#post-history-${id} video`);
      if (newVideo) {
        newVideo.play().catch((err) => {
          console.warn("Autoplay failed:", err);
        });
      }

      const newImage = document.querySelector(`#post-history-${id} img`);
      console.log("newImage", newImage);
      if (newImage) {
        newImage.style.display = "flex";
      }

      setVisiblePostId(id); // Update the currently playing video ID
    } else {
      // If visible post is not a video, pause previously playing video
      if (visiblePostId) {
        const prevVideo = document.querySelector(
          `#post-history-${visiblePostId} video`
        );
        if (prevVideo) prevVideo.pause();
        setVisiblePostId(null);
      }
    }
  }, [scrolling, postHistory]);

  if (postHistoryStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  return (
    <Header
      status={postHistoryStatus}
      allowedSearch={true}
      name={"Posts"}
      setScroll={setScroll}
      reloadAction={reloadAction}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      feedRef={feedRef}
      children={
        <Box sx={{ height: "100%", overflowY: "auto" }}>
          {filteredData?.length === 0 ? (
            <p style={{ padding: "1rem", color: "#555" }}>No posts yet.</p>
          ) : (
            filteredData.map((post, index) => (
              <div
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                key={index}
              >
                <PostHistoryCard post={post} />
              </div>
            ))
          )}
        </Box>
      }
    />
  );
}

export default PostHistory;
