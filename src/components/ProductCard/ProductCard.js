import React from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product_id,
  title,
  description,
  product_images,
  price,
  oldPrice,
  unit,
}) => {
  const navigate = useNavigate();
  const reference_id = localStorage.getItem("reference_id");

  const handleNavigate = () => {
    navigate(`/${reference_id}/product/${product_id}`);
  };

  const renderImages = (images) => {
    const numberOfImages = images?.split(",").length;
    if (numberOfImages > 1) {
      return images.split(",").map((img) => img.trim())[0];
    } else {
      return images;
    }
  };

  return (
    <Card
      onClick={handleNavigate}
      sx={{
        width: 250,
        borderRadius: 4,
        boxShadow: 3,
        padding: 2,
        cursor: "pointer",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <Box display="flex" justifyContent="center">
        <img
          src={renderImages(product_images)}
          alt={title}
          style={{
            height: 140,
            width: "100%",
            objectFit: "cover",
            borderRadius: 12,
          }}
        />
      </Box>

      <CardContent sx={{ textAlign: "center", paddingTop: 2 }}>
        {/* <Box display="flex" justifyContent="center" mb={1}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} sx={{ color: "#fbc02d", fontSize: 18 }} />
          ))}
        </Box> */}

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="baseline"
          mt={2}
        >
          <Typography variant="h6" sx={{ color: "#2e7d32" }}>
            ${price}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: "line-through" }}
          >
            ${oldPrice}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            for {unit}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
