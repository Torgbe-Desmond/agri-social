import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { popComponent } from "../../Features/StackSlice";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../Features/ProductSlice";

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

const CreateProduct = ({ open, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [], // store image files
    price: "",
    oldPrice: "",
    unit: "",
  });

  const dispatch = useDispatch();
  const [imagePreviews, setImagePreviews] = useState([]);
  const { userDetails } = useSelector((state) => state.auth);
  const { createProductStatus } = useSelector((state) => state.product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    const updatedPreviews = [...imagePreviews];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };

  const handleFormSubmit = () => {
    const productData = new FormData();
    productData.append("title", formData?.title);
    productData.append("description", formData?.description);
    productData.append("price", formData?.price);
    productData.append("oldPrice", formData?.oldPrice);
    productData.append("unit", formData?.unit);
    for (let i = 0; i < formData.images.length; i++) {
      productData.append("files", formData?.images[i]);
    }
    dispatch(createProduct({ formData: productData }));
    // Reset form
    // setFormData({
    //   title: "",
    //   description: "",
    //   images: [],
    //   price: "",
    //   oldPrice: "",
    //   unit: "",
    // });
    // setImagePreviews([]);
  };

  const handleClose = () => {
    dispatch(popComponent());
  };

  return (
    <Modal open={true}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Create New Product
        </Typography>

        <Stack spacing={2}>
          <TextField
            disabled={createProductStatus === "loading"}
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            disabled={createProductStatus === "loading"}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
          />

          <Button
            disabled={createProductStatus === "loading"}
            className="sidebar__tweet__contained"
            variant="outlined"
            component="label"
          >
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
                    disabled={createProductStatus === "loading"}
                    size="small"
                    onClick={() => handleRemoveImage(idx)}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: "#fff",
                      boxShadow: 1,
                    }}
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
            disabled={createProductStatus === "loading"}
          />
          <TextField
            label="Old Price"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={handleChange}
            fullWidth
            disabled={createProductStatus === "loading"}
          />
          <TextField
            label="Unit"
            name="unit"
            disabled={createProductStatus === "loading"}
            value={formData.unit}
            onChange={handleChange}
            fullWidth
          />

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button
              sx={{
                borderRadius: "32px !important",
              }}
              disabled={createProductStatus === "loading"}
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            {createProductStatus === "loading" ? (
              <CircularProgress />
            ) : (
              <Button
                className="sidebar__tweet__contained"
                onClick={handleFormSubmit}
                variant="outlined"
              >
                Save
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateProduct;
