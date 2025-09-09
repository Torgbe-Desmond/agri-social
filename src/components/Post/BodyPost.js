import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import FeedImageCard from "../FeedImageCard/FeedImageCard";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ComponentStack from "../HandleStack/HandleStack";

function BodyPost({ post }) {
  const { reference_id } = useParams();
  const dispatch = useDispatch();

  const handleJoinGroupModal = (group_id) => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("JoinGroup", { group_id, post_owner: post?.user_id });
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
          post_id: post?.post_id,
          type: "image",
        }))
      );
    }
    if (post?.videos) {
      mediaArray.push(
        ...post.videos.split(",").map((src) => ({
          url: src.trim(),
          post_id: post?.post_id,
          type: "video",
        }))
      );
    }
    return mediaArray;
  }, [post]);

  return (
    <div className="post__body">
      {/* Post Content */}
      {post?.content && (
        <Typography sx={{ fontSize: "14px" }} component="div">
          {things(post)}
        </Typography>
      )}

      {/* Media Section */}
      <div className="post__images">
        {combinedMedia.length > 0 && (
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              // overflow: "hidden",
              borderRadius: 2,
              border: "1px solid red",
              borderColor: "divider",
            }}
          >
            <FeedImageCard media={combinedMedia} />
          </Box>
        )}
      </div>
    </div>
  );
}

export default BodyPost;
