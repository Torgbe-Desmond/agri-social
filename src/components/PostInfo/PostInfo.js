import React from "react";
import "./PostInfo.css";
import { Box } from "@mui/material";

function PostInfo({ content }) {
  const style = {
    fontSize: "32px",
    cursor: "pointer",
    filter: "drop-shadow(2px 2px 4px rgba(9, 8, 8, 0.5))",
  };
  return <Box className="post-info">{content}</Box>;
}

export default PostInfo;
