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
}) {
  const lastScrollTop = useRef(0);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const feedRef = useRef(null);
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();

  useEffect(() => {
    const feedNode = feedRef.current;
    if (!feedNode) return;

    const handleScroll = () => {
      const scrollTop = feedNode.scrollTop;
      if (scrollTop < lastScrollTop.current) {
        dispatch(setScrolling(true)); // scrolling down
      } else {
        dispatch(setScrolling(false)); // scrolling up
      }
      lastScrollTop.current = scrollTop;
    };

    feedNode.addEventListener("scroll", handleScroll);
    return () => feedNode.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box ref={feedRef} className="resuable">
      <Box
        sx={{ bgcolor: systemPrefersDark ? "background.paper" : "#FFF" }}
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
