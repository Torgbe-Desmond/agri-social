import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Bookmarks.css";
// import "./Header.css"; // keep styles
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { useGetSavedHistoryQuery } from "../../Features/postApi";
import { updateSavedPostList } from "../../Features/PostSlice";
import Bookmark from "../../components/Bookmark/Bookmark";
import ErrorInfoAndReload from "../../components/Errors/ErrorInfoAndReload";
import ContainerTitle from "../../components/Container/ContainerTitle";
import ContainerSearch from "../../components/Container/ContainerSearch";
import Container from "../../components/Container/Container";

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
  const [fetchError, setFetchError] = useState(false);
  const theme = useTheme();

  const { data, isFetching, isLoading, error, refetch, isError } =
    useGetSavedHistoryQuery({ offset: pageNumber, limit: 10 });

  const postData = useMemo(() => {
    return Array.isArray(data?.posts) ? data.posts : [];
  }, [data]);

  const hasMore = postData?.length > 0;

  // Update store with new saved posts
  useEffect(() => {
    if (postData?.length > 0) {
      dispatch(updateSavedPostList({ postData }));
    }
  }, [postData, dispatch]);

  useEffect(() => {
    setFetchError(isError);
  }, [isError]);

  // Reset refs when filteredData changes
  useEffect(() => {
    itemRefs.current = [];
  }, [filteredData]);

  // Filter savedHistory based on search term
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

  // Infinite scroll observer
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

  // Image lazy load
  const onImageReach = useCallback(() => {
    const visibleItems = itemRefs.current.filter((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    visibleItems.forEach((el) => {
      const postId = el
        ?.querySelector(".bookmark")
        ?.id?.replace("bookmark-", "");
      if (!postId) return;

      const currentImage = document.querySelector(`#bookmark-${postId} img`);
      if (currentImage) currentImage.style.display = "flex";
    });
  }, []);

  // Video autoplay on visible post
  const onVideoReach = useCallback(() => {
    const itemsWithCoverage = itemRefs?.current
      .map((el) => {
        if (!el) return null;
        const rect = el.getBoundingClientRect();

        const visibleHeight =
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const clampedHeight = Math.max(0, visibleHeight);

        const percentOfViewport = (clampedHeight / window.innerHeight) * 100;

        return { el, percentOfViewport };
      })
      .filter((item) => item && item.percentOfViewport > 0);

    if (!itemsWithCoverage?.length) return;

    const largestItem = itemsWithCoverage.reduce((max, item) =>
      item.percentOfViewport > max.percentOfViewport ? item : max
    );

    const postId = largestItem.el
      .querySelector(".bookmark")
      ?.id?.replace("bookmark-", "");

    if (!postId) return;

    const isVideoPost = savedHistory.find(
      (p) => p.post_id === postId && p.has_video
    );
    if (!isVideoPost) return;

    if (visiblePostId && visiblePostId !== postId) {
      const prev = document.querySelector(`#bookmark-${visiblePostId} video`);
      if (prev) prev.pause();
    }

    const currentVideo = document.querySelector(`#bookmark-${postId} video`);
    if (currentVideo) {
      currentVideo.muted = true;
      currentVideo.play().catch((err) => console.warn("Autoplay failed:", err));
    }

    setVisiblePostId(postId);
  }, [savedHistory, visiblePostId, itemRefs]);

  // Trigger checks when scrolling
  useEffect(() => {
    itemRefs.current.forEach((el) => {
      el?.classList.remove("visible-post", "visible-post-next");
    });
    onVideoReach();
    onImageReach();
  }, [scrolling, savedHistory, onVideoReach, onImageReach]);

  // Listen to scroll events
  useEffect(() => {
    const scrollContainer = feedRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScroll((prev) => prev + 1);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box ref={feedRef} className="container">
      {/* Header section */}
      <Container>
        <ContainerTitle title={"Bookmarks"} />
        <ContainerSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search bookmarks"
        />
      </Container>

      {/* Content */}
      {isLoading ? (
        <Box className="circular__progress">
          <CircularProgress size={20} />
        </Box>
      ) : (
        <Box className="scrolling-component">
          {filteredData?.map((saved, index) => {
            const isLast = index === filteredData.length - 1;
            return (
              <div
                key={saved.post_id || index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                  if (isLast) lastPostRef(el);
                }}
                className="bookmark-media-wrapper"
              >
                <Bookmark bookmark={saved} />
              </div>
            );
          })}
        </Box>
      )}
      {fetchError && (
        <ErrorInfoAndReload
          setFetchError={setFetchError}
          isError={fetchError}
          isLoading={isLoading}
          isFetching={isFetching}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

export default Bookmarks;
