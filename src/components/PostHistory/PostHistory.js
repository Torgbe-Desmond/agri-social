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
import ContainerSearch from "../Container/ContainerSearch";
import ContainerHeader from "../Container/ContainerHeader";
import Container from "../Container/Container";

function PostHistory() {
  const { user_id } = useOutletContext();
  const feedRef = useRef();
  const itemRefs = useRef([]);
  const observer = useRef();
  const [scrolling, setScroll] = useState(0);
  const [offset, setOffset] = useState(1);
  const [visiblePostId, setVisiblePostId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const [fetchError, setFetchError] = useState(false);
  const { postHistory, postHistoryOffset } = useSelector((state) => state.post);

  const { data, isFetching, isLoading, error, refetch, isError } =
    useGetPostHistoryQuery(
      { offset: postHistoryOffset, limit: 10 },
      { keepUnusedDataFor: 0 }
    );

  const hasMoreUserPost = postHistory.length > 0;

  const postData = useMemo(() => {
    return Array.isArray(data?.posts) ? data.posts : [];
  }, [data]);

  useEffect(() => {
    if (postData?.length > 0) {
      dispatch(updatePostHistoryList({ postData }));
    }
  }, [postData]);

  useEffect(() => {
    setFetchError(isError);
  }, [isError]);

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

  useEffect(() => {
    let isMounted = true;

    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (
          isMounted &&
          entries[0].isIntersecting &&
          hasMoreUserPost &&
          !isFetching
        ) {
          dispatch(setPostHistoryOffset());
        }
      });
    }

    return () => {
      isMounted = false;
      observer.current?.disconnect();
    };
  }, [hasMoreUserPost, isFetching, dispatch]);

  const lastPostRef = useCallback((node) => {
    observer.current?.disconnect();
    node && observer.current?.observe(node);
  }, []);

  // Check visible posts for videos and images
  const onImageReach = useCallback(() => {
    const visibleItems = itemRefs.current.filter((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    visibleItems.forEach((el) => {
      const postId = el?.querySelector(".phd")?.id?.replace("phd-", "");
      if (!postId) return;

      const currentImage = document.querySelector(`#phd-${postId} img`);
      if (currentImage) currentImage.style.display = "flex";
    });
  }, []);

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
      .querySelector(".phd")
      ?.id?.replace("phd-", "");

    if (!postId) return;

    // 🔄 Use postData, since it contains ALL saved posts
    const isVideoPost = postHistory.find(
      (p) => p.post_id === postId && p.has_video
    );

    if (!isVideoPost) return;

    if (visiblePostId && visiblePostId !== postId) {
      const prev = document.querySelector(`#phd-${visiblePostId} video`);
      if (prev) prev.pause();
    }

    const currentVideo = document.querySelector(`#phd-${postId} video`);

    if (currentVideo) {
      console.log(
        `Playing video for post ${postId} (${largestItem.percentOfViewport.toFixed(
          1
        )}% visible)`
      );
      currentVideo.muted = true;
      currentVideo.play().catch((err) => console.warn("Autoplay failed:", err));
    }

    setVisiblePostId(postId);
  }, [postHistory, visiblePostId, itemRefs]);

  useEffect(() => {
    itemRefs.current.forEach((el) => {
      el?.classList.remove("visible-post", "visible-post-next");
    });
    onVideoReach(itemRefs);
    onImageReach(itemRefs);
  }, [scrolling, postData]);

  const filteredData = searchTerm
    ? postHistory.filter(
        (p) =>
          p.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : postHistory;

  return (
    <Box ref={feedRef} className="container">
      <Container>
        <ContainerHeader />
        <ContainerSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search Posts"
        />
      </Container>

      {filteredData.map((post, index) => {
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
      })}
      {fetchError ||
        (isLoading && (
          <ErrorInfoAndReload
            setFetchError={setFetchError}
            isError={fetchError}
            isLoading={isLoading}
            isFetching={isFetching}
            refetch={refetch}
          />
        ))}
    </Box>
  );
}

export default PostHistory;
