import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { removeDeletedPost } from "../../Features/PostSlice";
import { useDeletePostMutation } from "../../Features/postApi";

const DeletePostModal = ({ post_id }) => {
  const dispatch = useDispatch();
  const theme = useTheme(); // 🔹 Access current theme (light/dark)
  const [deletePost, { isLoading }] = useDeletePostMutation();

  const handlePostDelete = async () => {
    const payload = await deletePost({ post_id }).unwrap();
    dispatch(removeDeletedPost({ payload }));
    dispatch(popComponent());
  };

  return (
    <Modal open={true}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "80%", sm: "70%", md: "500px" },
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
        }}
      >
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          Delete
        </Typography>
        <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

        <Typography sx={{ mb: 2 }}>
          Are you sure you want to delete this post?
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "32px",
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
            }}
            disabled={isLoading}
            onClick={() => dispatch(popComponent())}
          >
            Cancel
          </Button>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Button
              disabled={isLoading}
              onClick={handlePostDelete}
              variant="contained"
              sx={{
                borderRadius: "32px",
                bgcolor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                "&:hover": {
                  bgcolor: theme.palette.error.dark,
                },
              }}
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
