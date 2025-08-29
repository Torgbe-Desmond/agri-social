import React, { useEffect, useRef } from "react";
import "./Header.css";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { setScrolling } from "../../Features/StackSlice";

function Header({
  icons,
  status,
  name,
  searchTerm,
  setSearchTerm,
  allowedSearch,
  children,
  userDetailComponent,
  reloadAction,
  feedRef,
  setScroll,
}) {
  const lastScrollTop = useRef(0);
  const dispatch = useDispatch();
  const theme = useTheme(); // 👈 Access MUI theme

  useEffect(() => {
    const scrollContainer = document.querySelector(".resuable");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      setScroll((prev) => prev + 1);
      lastScrollTop.current = scrollTop;
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  return (
    <Box ref={feedRef} className="resuable">
      <Box
        sx={{
          bgcolor: theme.palette.background.paper, // 👈 Theme-based background
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
        className="resuable__header"
      >
        <Typography
          variant="h2"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pt: !allowedSearch ? 2 : "",
            pb: !allowedSearch ? 2 : "",
          }}
        >
          {name}
          {icons?.map((i, index) => (
            <Box
              sx={{
                cursor: "pointer",
                "&:hover": { color: theme.palette.primary.main },
              }}
              onClick={i.action}
              key={index}
            >
              {i.icon}
            </Box>
          ))}
        </Typography>

        {userDetailComponent && userDetailComponent}

        {allowedSearch && (
          <Box
            sx={{
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              paddingLeft: 1,
            }}
            className="resuable__input"
          >
            <SearchIcon
              className="resuable__searchIcon"
              sx={{ color: theme.palette.text.secondary }}
            />
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
                    color: theme.palette.text.primary,
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
        <Box className="circular__progress">
          <CircularProgress size={20} />
        </Box>
      ) : (
        <Box className="scrolling-component">{children}</Box>
      )}

      {reloadAction && status === "failed" && (
        <Box className="circular__progress">
          <Button
            onClick={reloadAction}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.light,
                backgroundColor: theme.palette.action.hover,
              },
            }}
            variant="outlined"
          >
            Reload
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Header;
