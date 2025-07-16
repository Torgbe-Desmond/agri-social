import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { setScrolling } from "../../Features/StackSlice";
import { useOutletContext } from "react-router-dom";

function Header({
  icons,
  status,
  name,
  searchTerm,
  setSearchTerm,
  allowedSearch,
  children,
  reloadAction,
  feedRef,
  setScroll,
}) {
  const lastScrollTop = useRef(0);
  const dispatch = useDispatch();
  const { systemPrefersDark } = useOutletContext();

  useEffect(() => {
    const scrollContainer = document.querySelector(".resuable");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      setScroll((prev) => prev + 1);
      lastScrollTop.current = scrollTop;
      console.log("ddddd");
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  return (
    <Box ref={feedRef} className="resuable">
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: systemPrefersDark ? "background.paper" : "#FFF",
        }}
        className="resuable__header"
      >
        <Typography variant="h2">
          {name}
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
              placeholder={`Search ${name?.toLowerCase() || ""}`}
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
        )}
      </Box>

      {status === "loading" ? (
        <p className="circular__progress">
          <CircularProgress size={20} />
        </p>
      ) : (
        <Box
          className="scrolling-component"
          // sx={{ height: "100%", overflowY: "auto" }}
        >
          {children}
        </Box>
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
