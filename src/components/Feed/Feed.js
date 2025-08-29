import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Post from "../Post/Post";
import "./Feed.css";
import { useOutletContext } from "react-router-dom";
import { Box, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setOffset, setScrolling } from "../../Features/StackSlice";
import { useGetPostsQuery } from "../../Features/postApi";
import { setPostsOffset, updatePostList } from "../../Features/PostSlice";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";
import { useError } from "../Errors/Errors";
import useWindowSize from "../useWindowSize/useWindowSize";
import Container from "../Container/Container";
import TopHeader from "../TopHeader/TopHeader";

function Feed() {
  const { location } = useOutletContext();
  const dispatch = useDispatch();
  const feedRef = useRef(null);
  const observer = useRef();
  const lastScrollTop = useRef(0);
  const itemRefs = useRef([]);
  const [scrolling, setScroll] = useState(0);
  const [offset, setLocalOffset] = useState(1);
  const [visiblePostId, setVisiblePostId] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const { posts, postsOffset } = useSelector((state) => state.post);
  const [viewedPosts, setViewedPosts] = useState([]);

  // Query posts with RTK Query
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetPostsQuery({ offset: postsOffset, limit: 10 });

  const { message, setMessage } = useError();

  useEffect(() => {
    if (isError && error?.data?.detail) {
      setMessage(error.data.detail);
    }
  }, [isError, error, setMessage]);

  const postData = useMemo(() => {
    return Array.isArray(data?.posts) ? data.posts : [];
  }, [data]);

  const hasMore = postData?.length > 0;

  useEffect(() => {
    if (postData?.length > 0) {
      dispatch(updatePostList({ postData }));
    }
  }, [postData]);

  // Infinite scroll intersection observer
  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isFetching) {
          dispatch(setPostsOffset());
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, isFetching, dispatch]
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

  useEffect(() => {
    itemRefs.current.forEach((el) => {
      el?.classList.remove("visible-post", "visible-post-next");
    });
    onVideoReach(itemRefs);
    onImageReach(itemRefs);
    onPostReach(itemRefs);
  }, [scrolling, postData, itemRefs]);

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
      .querySelector(".post")
      ?.id?.replace("post-", "");

    if (!postId) return;

    const isVideoPost = posts.find((p) => p.post_id === postId && p.has_video);

    if (!isVideoPost) return;

    if (visiblePostId && visiblePostId !== postId) {
      const prev = document.querySelector(`#post-${visiblePostId} video`);
      if (prev) prev.pause();
    }

    const currentVideo = document.querySelector(`#post-${postId} video`);

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
  }, [posts, visiblePostId, itemRefs]);

  function onPostReach(itemRefs) {}

useEffect(() => {
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
    .querySelector(".post")
    ?.id?.replace("post-", "");

  if (!postId) return;

  setViewedPosts((prev) => {
    if (prev.includes(postId)) return prev; 
    return [...prev, postId];
  });
// low medium high
  const delayDebounce = setTimeout(() => {
    console.log("viewedPosts updated:", viewedPosts);
  }, 3000);

  return () => clearTimeout(delayDebounce);
}, [itemRefs, scrolling, viewedPosts]); 

  return (
    <Box
      sx={{
        height: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
      className="profile"
      ref={feedRef}
    >
      {posts?.map((post, index) => {
        const isLast = index === postData.length - 1;
        return (
          <div
            key={post.post_id ?? index}
            ref={(el) => {
              itemRefs.current[index] = el;
              if (isLast) lastPostRef(el);
            }}
          >
            <Post post={post} />
          </div>
        );
      })}
      {fetchError && (
        <ErrorInfoAndReload
          setFetchError={setFetchError}
          isError={fetchError}
          refetch={refetch}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      )}
    </Box>
  );
}

export default Feed;
