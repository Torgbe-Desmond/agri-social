import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { useDeleteProductMutation } from "../../Features/productApi";
import { removeDeletedProduct } from "../../Features/ProductSlice";

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
  const dispatch = useDispatch();
  const [deleteProduct, { isLoading, isSuccess }] = useDeleteProductMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(popComponent());
    }
  }, [isSuccess]);

  const handleProductDelete = async () => {
    try {
      const payload = await deleteProduct(product_id).unwrap();
      dispatch(removeDeletedProduct({ payload }));
      dispatch(popComponent());
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <Modal open={true}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Delete
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to delete this product?
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            color="secondary"
            sx={{ borderRadius: "32px !important" }}
            variant="outlined"
            disabled={isLoading}
            onClick={() => dispatch(popComponent())}
          >
            Cancel
          </Button>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Button
              className="sidebar__tweet__contained"
              onClick={handleProductDelete}
              variant="outlined"
              disabled={isLoading}
              color="error"
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
