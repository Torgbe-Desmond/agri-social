import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import FeedImageCard from "../FeedImageCard/FeedImageCard";
import "./PostComment.css";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ComponentStack from "../HandleStack/HandleStack";

function CommentSinglePostBody({ post }) {
  const { reference_id } = useParams();
  const dispatch = useDispatch();

  const handleJoinGroupModal = (conversation_id) => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("JoinGroup", { conversation_id });
  };

  function things(post) {
    if (!post.content) return null;

    const mentionMap = new Map(
      (post.mentions || []).map((m) => [m.id.toString(), m.username])
    );
    const groupMap = new Map(
      (post.groups || []).map((g) => [g.id.toString(), g.name])
    );

    const urlRegex = /^https?:\/\/[^\s]+$/;
    const tokens = post.content.split(" ");

    return tokens.map((token, idx) => {
      if (mentionMap.has(token)) {
        const username = mentionMap.get(token);
        return (
          <a
            key={idx}
            href={`/${reference_id}/user/${token}`}
            style={{ color: "#1976d2", fontWeight: 600, cursor: "pointer" }}
          >
            @{username}
          </a>
        );
      }
      if (groupMap.has(token)) {
        const groupName = groupMap.get(token);
        return (
          <a
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              handleJoinGroupModal(token);
            }}
            style={{
              textDecoration: "none",
              color: "#1976d2",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ${groupName}
          </a>
        );
      }
      if (urlRegex.test(token)) {
        return (
          <a
            key={idx}
            href={token}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1976d2", fontWeight: 600, cursor: "pointer" }}
          >
            {token}
          </a>
        );
      }
      return <span key={idx}> {token} </span>;
    });
  }

  const combinedMedia = useMemo(() => {
    const mediaArray = [];
    if (post?.images) {
      mediaArray.push(
        ...post.images.split(",").map((src) => ({
          url: src.trim(),
          type: "image",
        }))
      );
    }
    if (post?.videos) {
      mediaArray.push(
        ...post.videos.split(",").map((src) => ({
          url: src.trim(),
          type: "video",
        }))
      );
    }
    return mediaArray;
  }, [post]);

  const renderTags = (tags) => {
    if (!tags) return null;
    return tags.split(",").map((tag, index) => (
      <Typography
        color="primary"
        sx={{ padding: "0px", pr: 0.5 }}
        variant="body2"
        key={index}
        className="comment-single-post-tag"
      >
        #{tag.trim()}
      </Typography>
    ));
  };

  return (
    <div className="comment-single-post-body">
      {/* Post Text Content */}
      {post?.content && (
        <Typography sx={{ fontSize: "14px" }} component="div">
          {things(post)}
        </Typography>
      )}

      {/* Media + Tags */}
      <div className="comment-single-post-media-section">
        {/* Tags */}
        {post?.tags && (
          <div className="comment-single-post-tags">
            {renderTags(post.tags)}
          </div>
        )}

        {/* Images / Videos */}
        {combinedMedia.length > 0 && (
          <Box
            className="comment-single-post-media-wrapper"
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
            }}
          >
            <FeedImageCard media={combinedMedia && combinedMedia} />
          </Box>
        )}
      </div>
    </div>
  );
}

export default CommentSinglePostBody;
