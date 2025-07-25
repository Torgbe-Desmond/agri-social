import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function FeedImageCard({ images }) {
  const length = images?.length || 1;

  return (
    <ImageList
      sx={{ width: "100%", height: "auto" }}
      variant="quilted"
      cols={length > 1 ? 2 : 1}
      rowHeight={180}
    >
      {images.map((item, index) => (
        <ImageListItem
          key={index}
          cols={length > 1 ? 1 : 2}
          rows={1}
          sx={{
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <img
            {...srcset(item, 121, 1, 1)}
            alt={`post-image-${index}`}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: `${length > 1 ? "contain" : "cover"}`,
              borderRadius: "8px",
            }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
