import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function PredictionHeader({ systemPrefersDark, searchTerm, setSearchTerm }) {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: systemPrefersDark ? "background.paper" : "#FFF",
      }}
      className="predictions__header"
    >
      <Typography variant="h2">Predictions</Typography>

      <Box
        sx={{ bgcolor: "background.paper", border: "1px solid #ccc" }}
        className="resuable__input"
      >
        <SearchIcon className="resuable__searchIcon" />
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search Predictions`}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "transparent" },
              "& .MuiInputBase-input": {
                width: { xs: "100%", md: "500px" },
              },
              "&:hover fieldset": { borderColor: "transparent" },
              "&.Mui-focused fieldset": { borderColor: "transparent" },
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default PredictionHeader;
