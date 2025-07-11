import React from "react";
import "./Header.css";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Header({
  icons,
  status,
  name,
  searchTerm,
  setSearchTerm,
  allowedSearch,
  children,
  reloadAction,
}) {
  return (
    <Box className="resuable">
      <Box className="resuable__header">
        <Typography variant="h2">
          {name}{" "}
          {icons?.map((i, index) => (
            <Box sx={{ cursor: "pointer" }} onClick={i.action} key={index}>
              {i.icon}
            </Box>
          ))}
        </Typography>
        {allowedSearch && (
          <Box
            sx={{ bgcolor: "background.paper", border: "1px solid #ccc" }}
            className="resuable__input"
          >
            <SearchIcon className="resuable__searchIcon" />
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${name ? name?.toLowerCase() : ""}`}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "& .MuiInputBase-input": {
                    width: { xs: "100%", sm: "100%", md: "500px", lg: "500px" },
                    boxSizing: "border-box",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
              }}
            />{" "}
          </Box>
        )}
      </Box>

      {status && status === "loading" ? (
        <p className="circular__progress">
          <CircularProgress fontSize="small" />
        </p>
      ) : (
        children
      )}
      {reloadAction && status === "failed" && (
        <p className="circular__progress">
          <Button onClick={reloadAction}>Reload</Button>
        </p>
      )}
    </Box>
  );
}

export default Header;
