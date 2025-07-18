import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { deletePost } from "../../Features/PostSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "80%", sm: "70%", md: "500px" },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
};

const DeletePostModal = ({ post_id }) => {
  const { postStatus, postData, selectedPostId, postDeleteStatus } =
    useSelector((state) => state.post);
  const dispatch = useDispatch();

  const handlePostDelete = () => {
    dispatch(deletePost({ post_id }))
      .unwrap()
      .then(() => {
        dispatch(popComponent());
      });
  };

  return (
    <Modal open={true}>
      <Box sx={style}>
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          Delete
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ mb: 2 }}>
          Are you sure you want to delete this post ?
        </Typography>
        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "32px !important",
            }}
            color="secondary"
            onClick={() => dispatch(popComponent())}
          >
            Cancel
          </Button>
          {postDeleteStatus === "loading" ? (
            <CircularProgress />
          ) : (
            <Button
              className="sidebar__tweet__contained"
              onClick={() => handlePostDelete()}
              variant="outlined"
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default DeletePostModal;
