import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/material";

function Comment_Header({ systemPrefersDark, handleGoBack, name }) {
  return (
    <Box
      sx={{
        background: systemPrefersDark && "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
      className="post__comment__header"
    >
      <h2>
        <ArrowBackIcon cursor="pointer" onClick={handleGoBack} /> {name}
      </h2>
    </Box>
  );
}

export default Comment_Header;