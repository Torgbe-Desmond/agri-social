import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";

const PostActions = ({ onCancel, onPost, disabled, isLoading }) => {
  return (
    <Box display="flex" justifyContent="space-between" gap={1} mt={2}>
      <Button
        sx={{ borderRadius: "32px" }}
        variant="outlined"
        disabled={isLoading}
        fullWidth
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        sx={{ borderRadius: "32px" }}
        variant="contained"
        fullWidth
        onClick={onPost}
        disabled={disabled}
      >
        {isLoading ? <CircularProgress size={24} /> : "Post"}
      </Button>
    </Box>
  );
};

export default PostActions;
