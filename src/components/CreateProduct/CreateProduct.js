import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { useCreateProductMutation } from "../../Features/productApi";
import { addNewProduct } from "../../Features/ProductSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const CreateProduct = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    price: "",
    oldPrice: "",
    unit: "",
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [createProduct, { isLoading, isSuccess, error }] =
    useCreateProductMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };

  const handleFormSubmit = async () => {
    const productData = new FormData();
    productData.append("title", formData.title);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("oldPrice", formData.oldPrice);
    productData.append("unit", formData.unit);
    formData.images.forEach((img) => productData.append("files", img));

    try {
      const payload = await createProduct({ formData: productData }).unwrap();
      dispatch(addNewProduct({ payload }));
      setFormData({
        title: "",
        description: "",
        images: [],
        price: "",
        oldPrice: "",
        unit: "",
      });
      setImagePreviews([]);
      dispatch(popComponent());
    } catch (err) {
      console.error("Product creation failed:", err);
    }
  };

  const handleClose = () => {
    dispatch(popComponent());
  };

  return (
    <Modal open>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Create New Product
        </Typography>

        <Stack spacing={2}>
          {error && (
            <Alert severity="error">
              {error?.data?.message ||
                "Something went wrong while creating product."}
            </Alert>
          )}

          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            disabled={isLoading}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            disabled={isLoading}
          />

          <Button variant="outlined" component="label" disabled={isLoading}>
            Upload Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {imagePreviews.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {imagePreviews.map((img, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    width: 50,
                    height: 50,
                    borderRadius: 1,
                    overflow: "hidden",
                    border: "1px solid #ccc",
                  }}
                >
                  <img
                    src={img.preview}
                    alt={`preview-${idx}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(idx)}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      bgcolor: "#fff",
                      boxShadow: 1,
                    }}
                    disabled={isLoading}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          <TextField
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            disabled={isLoading}
          />
          <TextField
            label="Old Price"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={handleChange}
            fullWidth
            disabled={isLoading}
          />
          <TextField
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            fullWidth
            disabled={isLoading}
          />

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              variant="outlined"
              className="sidebar__tweet__contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : "Save"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateProduct;
