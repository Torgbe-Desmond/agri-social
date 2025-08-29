import { Box } from "@mui/material";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";
import { useCallback, useRef, useState, useEffect } from "react";
import Replies from "../Replies/Replies";
import ReplySingleComment from "./ReplySingleComment";

const CommentReplyList = ({
  chatContainerRef,
  commentReplies,
  isError,
  scrollAnchorRef,
  commentsLoading,
  isFetchingReplies,
  scrolling,
  refetchReplies,
}) => {
  const commentRef = useRef([]);
  const [visiblePostId, setVisiblePostId] = useState(null);

  const onVideoReach = useCallback(() => {
    const itemsWithCoverage = commentRef.current
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

    const postId = largestItem.el.id.replace("replies-single-comment-", "");

    if (!postId) return;

    console.log("commentReplies", commentReplies);

    const isVideoPost = commentReplies.find(
      (p) => p.id === postId && p.videos
    );

    if (!isVideoPost) return;

    // pause previous video
    if (visiblePostId && visiblePostId !== postId) {
      const prev = document.querySelector(
        `#replies-single-comment-${visiblePostId} video`
      );
      if (prev) prev.pause();
    }

    // play current video
    const currentVideo = document.querySelector(
      `#replies-single-comment-${postId} video`
    );

    console.log("currentVideo", currentVideo);

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
  }, [commentReplies, visiblePostId, scrolling]);

  useEffect(() => {
    onVideoReach();
  }, [scrolling]);

  return (
    <Box sx={{}} ref={chatContainerRef}>
      {commentReplies?.map((reply, index) => (
        <ReplySingleComment
          key={index}
          comment={reply}
          ref={(el) => {
            commentRef.current[index] = el;
          }}
        />
      ))}

      <ErrorInfoAndReload
        isError={isError}
        isLoading={commentsLoading}
        isFetching={isFetchingReplies}
        refetch={refetchReplies}
      />

      {/* <div ref={scrollAnchorRef} /> */}
    </Box>
  );
};

export default CommentReplyList;
