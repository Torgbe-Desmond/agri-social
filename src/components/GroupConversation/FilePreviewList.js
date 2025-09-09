import React from "react";
import { Box, IconButton } from "@mui/material";

function FilePreviewList({ files, setFiles, uploadedFiles, setUploadedFiles }) {
  return (
    <>
      {files.map((img, idx) => (
        <Box key={idx} sx={{ display: "inline-block", position: "relative", margin: "8px" }}>
          <img
            src={img}
            alt={`preview-${idx}`}
            style={{ width: 120, height: 120, borderRadius: 8, objectFit: "cover" }}
          />
          <IconButton
            size="small"
            onClick={() => {
              setFiles((prev) => prev.filter((_, i) => i !== idx));
              setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
            }}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
            aria-label="Remove image"
          >
            &times;
          </IconButton>
        </Box>
      ))}
    </>
  );
}

export default FilePreviewList;
