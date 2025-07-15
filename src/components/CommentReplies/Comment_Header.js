import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/material";

function Comment_Header({ systemPrefersDark, handleGoBack }) {
  return (
    <Box
      sx={{ background: systemPrefersDark && "background.paper" }}
      className="post__comment__header"
    >
      <h2>
        <ArrowBackIcon cursor="pointer" onClick={handleGoBack} /> Post
      </h2>
    </Box>
  );
}

export default Comment_Header;
