import React from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MediaPreviewGrid = ({ mediaList, handleRemoveMedia, isLoading }) => {
  const theme = useTheme();
  if (!mediaList?.length) return null;

  return (
    <Box
      mt={2}
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(70px, 1fr))"
      gap={1}
    >
      {mediaList.map((m, idx) => (
        <Box key={idx} position="relative">
          <IconButton
            disabled={isLoading}
            size="small"
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              backgroundColor: theme.palette.background.paper,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              zIndex: 1,
            }}
            onClick={() => handleRemoveMedia(idx)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          {m.type === "image" ? (
            <img
              src={m.preview}
              alt="Preview"
              style={{
                width: "70px",
                height: 70,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : (
            <video
              src={m.preview}
              controls
              style={{
                width: 70,
                height: 70,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default MediaPreviewGrid;
