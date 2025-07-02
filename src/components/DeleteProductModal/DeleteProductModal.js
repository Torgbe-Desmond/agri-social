import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { deletePost } from "../../Features/PostSlice";
import { deleteProduct, handleStatus } from "../../Features/ProductSlice";

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

const DeleteProductModal = ({ product_id }) => {
  const { deleteProductStatus } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    if (deleteProductStatus === "succeeded") {
      dispatch(popComponent());
    }
  }, [deleteProductStatus]);

  useEffect(() => {
    return () => dispatch(handleStatus());
  }, []);

  const handlePostDelete = () => {
    dispatch(deleteProduct({ product_id }));
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
          Are you sure you want to delete this product ?
        </Typography>
        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            color="secondary"
            sx={{
              borderRadius: "32px !important",
            }}
            variant="outlined"
            onClick={() => dispatch(popComponent())}
          >
            Cancel
          </Button>
          {deleteProductStatus === "loading" ? (
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
        </Stack>
      </Box>
    </Modal>
  );
};

export default DeleteProductModal;
