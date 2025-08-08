import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Bookmarks.css";
import { Box, Button, CircularProgress } from "@mui/material";
import Saved from "../../components/Saved/Saved";
import Header from "../../components/Header/Header";
import { useGetSavedHistoryQuery } from "../../Features/postApi";
import { updateSavedPostList } from "../../Features/PostSlice";
import { useDispatch, useSelector } from "react-redux";

const Bookmarks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePostId, setVisiblePostId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const feedRef = useRef(null);
  const itemRefs = useRef([]);
  const observer = useRef();
  const [scrolling, setScroll] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const { savedHistory } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const { data, isFetching, isLoading, isError, error, refetch } =
    useGetSavedHistoryQuery({
      offset: pageNumber,
      limit: 10,
    });

  console.log("error", error);

  const postData = useMemo(() => {
    return Array.isArray(data?.posts) ? data.posts : [];
  }, [data]);

  const hasMore = postData?.length > 0;

  useEffect(() => {
    if (postData?.length > 0) {
      dispatch(updateSavedPostList({ postData }));
    }
  }, [postData]);

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
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, isFetching]
  );

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

    visibleItems.forEach((el) => {
      const postId = el
        ?.querySelector(".post")
        ?.id?.replace("post-bookmarks-", "");
      if (!postId) return;

      const currentImage = document.querySelector(
        `#post-bookmarks-${postId} img`
      );
      if (currentImage) currentImage.style.display = "flex";
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
      ?.querySelector(".post")
      ?.id?.replace("post-bookmarks-", "");
    if (!postId) return;

    const isVideoPost = savedHistory.find(
      (p) => p.post_id === postId && p.has_video
    );
    if (!isVideoPost) return;

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
          {filteredData?.map((saved, index) => {
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
          {isLoading && (
            <p className="circular__progress">
              <CircularProgress size={20} />
            </p>
          )}
          {isError && (
            <p className="circular__progress">
              Something went wrong. <Button onClick={refetch}>Retry</Button>
            </p>
          )}
        </Box>
      }
    />
  );
};

export default Bookmarks;
