import { Box, IconButton, Stack, Avatar } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const ProductImageCarousel = ({
  imagesArray,
  selectedIndex,
  handlePrev,
  handleNext,
  setSelectedIndex,
}) => (
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
              index === selectedIndex ? "2px solid #007bff" : "1px solid #ccc",
            cursor: "pointer",
          }}
          onClick={() => setSelectedIndex(index)}
        />
      ))}
    </Stack>
  </Box>
);

export default ProductImageCarousel;
