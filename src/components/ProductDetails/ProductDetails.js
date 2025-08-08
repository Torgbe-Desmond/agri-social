import React, { useEffect, useRef, useState } from "react";
import "./ProductDetails.css";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGetProductQuery } from "../../Features/productApi";

function ProductDetails() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { product_id } = useParams();
  const navigate = useNavigate();
  const { systemPrefersDark } = useOutletContext();

  const {
    data: product,
    isLoading,
    isFetching,
  } = useGetProductQuery({ product_id }, { skip: !product_id });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? (renderImages(product?.product_images)?.length || 1) - 1 : prev - 1
    );
  };

  const handleNext = () => {
    const length = renderImages(product?.product_images)?.length || 1;
    setSelectedIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const renderImages = (images) => {
    return typeof images === "string"
      ? images.split(",").map((img) => img.trim())
      : [];
  };

  const imagesArray = renderImages(product?.product_images);

  return (
    <Box className="profile">
      <Box className="notifications__header">
        <h2>
          <ArrowBackIcon cursor="pointer" onClick={handleGoBack} /> Product
        </h2>
      </Box>

      {isLoading || isFetching ? (
        <div className="product_progress">
          <CircularProgress />
        </div>
      ) : (
        <Box sx={{ overflow: "hidden", fontFamily: "sans-serif" }}>
          {/* Image Carousel */}
          <Box position="relative">
            <img
              src={
                imagesArray[selectedIndex] ||
                "https://via.placeholder.com/600x320?text=No+Image"
              }
              alt="product"
              style={{ width: "100%", height: 320, objectFit: "cover" }}
            />

            {imagesArray.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: 8,
                    transform: "translateY(-50%)",
                  }}
                >
                  <ArrowBackIos fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 8,
                    transform: "translateY(-50%)",
                  }}
                >
                  <ArrowForwardIos fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>

          {/* Thumbnails */}
          <Stack direction="row" spacing={1} justifyContent="center" py={1}>
            {imagesArray.map((img, index) => (
              <Avatar
                key={index}
                src={img}
                variant="rounded"
                sx={{
                  width: 60,
                  height: 60,
                  border:
                    index === selectedIndex
                      ? "2px solid #007bff"
                      : "1px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </Stack>

          {/* Product Info */}
          <Box px={2} pb={2}>
            {product?.contact && (
              <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">{product.contact}</Typography>
              </Stack>
            )}

            {product?.city && (
              <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">{product.city}</Typography>
              </Stack>
            )}
          </Box>
        </Box>
      )}

      {/* Sticky Bottom Review Input */}
      <Box
        sx={{ p: 1 }}
        display="flex"
        position="sticky"
        bottom="0"
        zIndex="100"
        gap={1}
        alignItems="center"
        bgcolor={systemPrefersDark ? "background.paper" : "#FFF"}
        borderTop="1px solid #ddd"
      >
        <TextField
          fullWidth
          placeholder="Write a review..."
          size="small"
          multiline
          minRows={1}
          maxRows={3}
        />
        <IconButton>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ProductDetails;
