import { useCallback, useEffect, useRef, useState } from "react";
import "./Bookmarks.css";
import { useDispatch, useSelector } from "react-redux";
import Saved from "../../components/Saved/Saved";
import { Box, CircularProgress } from "@mui/material";
import { getSavedHistory } from "../../Features/PostSlice";
import Header from "../../components/Header/Header";
import { setScrolling } from "../../Features/StackSlice";

const Bookmarks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [visiblePostId, setVisiblePostId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const feedRef = useRef(null);
  const itemRefs = useRef([]);
  const { savedStatus, savedHistory, hasMoreSaved } = useSelector(
    (state) => state.post
  );
  const observer = useRef();

  // Scrolling trigger
  const [scrolling, setScroll] = useState(0);

  // Get saved history
  useEffect(() => {
    dispatch(getSavedHistory({ offset: pageNumber, limit: 10 }));
  }, [pageNumber, dispatch]);

  // Filter results
  useEffect(() => {
    const filtered = searchTerm
      ? savedHistory.filter(
          (item) =>
            item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.username?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : savedHistory;
    setFilteredData(filtered);
  }, [searchTerm, savedHistory]);

  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreSaved) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMoreSaved]
  );

  // Scroll effect to track visible video/image
  useEffect(() => {
    itemRefs.current.forEach((el) => {
      el?.classList.remove("visible-post", "visible-post-next");
    });
    onVideoReach(itemRefs);
    onImageReach(itemRefs);
  }, [scrolling, savedHistory]);

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
        el
          .querySelector(".post")
          ?.getAttribute("id")
          ?.replace("post-bookmarks-", "")
      )
      .filter(Boolean);

    postIds.forEach((id) => {
      const currentImage = document.querySelector(`#post-bookmarks-${id} img`);
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

    const postId = visibleItem
      .querySelector(".post")
      ?.id?.replace("post-bookmarks-", "");
    if (!postId) return;

    const isVideoPost = savedHistory.find(
      (p) => p.post_id === postId && p.has_video
    );
    if (!isVideoPost) return;

    // Pause previously playing video
    if (visiblePostId && visiblePostId !== postId) {
      const prev = document.querySelector(
        `#post-bookmarks-${visiblePostId} video`
      );

      if (prev) prev.pause();
    }

    const currentVideo = document.querySelector(
      `#post-bookmarks-${postId} video`
    );

    if (currentVideo) {
      currentVideo.play().catch((err) => console.warn("Autoplay failed:", err));
    }

    setVisiblePostId(postId);
  }

  return (
    <Header
      searchTerm={searchTerm}
      name="Bookmarks"
      allowedSearch
      setSearchTerm={setSearchTerm}
      setScroll={setScroll}
      ref={feedRef}
      children={
        <Box>
          {filteredData.map((saved, index) => {
            const isLast = index === savedHistory.length - 1;
            return (
              <div
                key={saved.post_id || index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                  if (isLast) lastPostRef(el);
                }}
                className="bookmark__item-wrapper"
              >
                <Saved save={saved} />
              </div>
            );
          })}
          {savedStatus === "loading" && (
            <p className="circular__progress">
              <CircularProgress fontSize="large" />
            </p>
          )}
        </Box>
      }
    />
  );
};

export default Bookmarks;
