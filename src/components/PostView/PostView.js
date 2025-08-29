import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { popComponent } from "../../Features/StackSlice";
import ViewOncePost from "../Post/ViewOncePost";

export default function PostView({ postId }) {
  const dispatch = useDispatch();
  const [selectedPost, setSelectedPost] = useState();
  const { posts } = useSelector((state) => state.post);

  useEffect(() => {
    if (posts?.length > 0) {
      const post = posts.find((p) => p.post_id === postId);
      setSelectedPost(post);
    }
  }, [posts, postId]);

  if (!selectedPost) return null;

  return (
    <Modal
      open={true}
      onClose={() => dispatch(popComponent())}
      aria-labelledby="post-view-modal"
      aria-describedby="view-once-post"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: "background.paper",
          borderRadius: "16px",
          boxShadow: 24,
          p: 3,
          width: "95%",
          maxWidth: 650,
          maxHeight: "80vh",
          // overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={() => dispatch(popComponent())}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "text.primary",
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Post Content */}
        <ViewOncePost post={selectedPost} />
      </Box>
    </Modal>
  );
}
