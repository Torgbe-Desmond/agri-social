import React from "react";
import { Box, Chip, Typography } from "@mui/material";

const LinksPreview = ({ links }) => {
  if (!links?.length) return null;

  return (
    <Box mt={2}>
      <Typography variant="subtitle2">Links:</Typography>
      {links.map((m, i) => (
        <Chip key={i} label={m} sx={{ mr: 1, mt: 1 }} />
      ))}
    </Box>
  );
};

export default LinksPreview;
