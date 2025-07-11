import React, { useEffect, useRef, useState } from "react";
import "./ProductDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
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
import { fetchProduct } from "../../Features/ProductSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ProductDetails() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { product_id } = useParams();
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const { product, loading } = useSelector((state) => state.product);
  const navigate = useNavigate();

  useEffect(() => {
    if (product_id) {
      dispatch(fetchProduct({ product_id }));
    }
  }, [product_id, dispatch]);

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? (product?.product_images?.length || 1) - 1 : prev - 1
    );
  };

  const renderImages = (images) => {
    return typeof images === "string"
      ? images.split(",").map((img) => img.trim())
      : [];
  };

  const handleNext = () => {
    let imagesLength = product?.product_images?.split(",");
    setSelectedIndex((prev) =>
      prev === (imagesLength.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box className="messages">
      <Box className="notifications__header">
        <h2>
          <ArrowBackIcon cursor="pointer" onClick={handleGoBack} /> Product
        </h2>
      </Box>
      {loading === "loading" ? (
        <div className="product_progress">
          {" "}
          <CircularProgress />
        </div>
      ) : (
        <Box
          sx={{
            borderBottom: "1px solid #ddd",
            overflow: "hidden",
            fontFamily: "sans-serif",
          }}
        >
          {/* Main Image with Carousel Controls */}
          <Box position="relative">
            <img
              src={
                renderImages(product?.product_images)[selectedIndex] ||
                "https://via.placeholder.com/600x320?text=No+Image"
              }
              alt="product"
              style={{ width: "100%", height: 320, objectFit: "cover" }}
            />

            {renderImages(product?.product_images).length > 1 && (
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
            {product?.product_images.split(",")?.map((img, index) => (
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
            {/* Phone */}
            {product?.contact && (
              <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">{product?.contact}</Typography>
              </Stack>
            )}

            {/* Location */}
            {product?.city && (
              <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">{product?.city}</Typography>
              </Stack>
            )}
          </Box>
        </Box>
      )}

      {/* Sticky Bottom Input */}
      <Box
        sx={systemPrefersDark ? { ...darkMode, p: 1 } : { p: 1 }}
        display="flex"
        position="sticky"
        bottom="0"
        zIndex="100"
        gap={1}
        alignItems="center"
        pt={1}
        borderTop="1px solid #ddd"
        bgcolor={systemPrefersDark ? darkMode.background : "#FFF"}
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
