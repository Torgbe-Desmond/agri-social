import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  useTheme,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "./TopHeader.css";
import ComponentStack from "../HandleStack/HandleStack";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearSearch,
  searchUser,
  selectedItem,
} from "../../Features/SearchSlice";
import { popComponent } from "../../Features/StackSlice";
import CloseIcon from "@mui/icons-material/Close";

function TopHeader({ systemPrefersDark }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchedUserDetails, searchedUserStatus } = useSelector(
    (state) => state.search
  );
  const reference_id = localStorage.getItem("reference_id");

  useEffect(() => {
    if (!searchTerm) return;
    const delayDebounce = setTimeout(() => {
      dispatch(searchUser({ username: searchTerm, offset: 0, limit: 20 }));
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
      dispatch(clearSearch());
    };
  }, [searchTerm, dispatch]);

  const filteredData = searchedUserDetails.filter(
    (item) =>
      item?.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigateToProfile = (item) => {
    if (item?.post_id) {
      navigate(`/${reference_id}/post/${item?.post_id}`);
    }
    if (item?.user_id) {
      navigate(`/${reference_id}/user/${item?.user_id}`);
    }
    if (item?.comment_id) {
      navigate(`/${reference_id}/replies/${item?.comment_id}`);
    }

    setSearchTerm("");
  };

  const handleOpenPostModal = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("CreatePost", {});
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "40px",
      height: "50px",
    },
  };

  return (
    <Box sx={{ width: "100%", position: "static", zIndex: 999 }}>
      <AppBar
        position="static"
        sx={{
          color: "#000",
          px: 2,
          py: 1,
          boxShadow: 0,
          borderBottom: 1,
          bgcolor: systemPrefersDark ? "#000" : "#FFF",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-evenly", gap: 2 }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src={require("../../assets/icons8-farmer-64.png")}
              alt="logo"
              width={35}
            />
          </Box>

          {/* Search Bar */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              p: 1,
              bgcolor: systemPrefersDark ? "background.paper" : "#FFF",
              border: 1,
              borderColor: "divider",
              maxWidth: "100%",
              borderRadius: "30px",
            }}
            position="sticky"
            bottom="0"
            zIndex="100"
            gap={1}
            pt={1}
            bgcolor="#FFF"
          >
            <TextField
              fullWidth
              sx={textFieldStyles}
              placeholder="Search AgriSocial"
              variant="standard"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <IconButton onClick={() => setSearchTerm("")}>
                    {searchedUserStatus == "loading" ? (
                      <CircularProgress size={20} />
                    ) : (
                      <CloseIcon />
                    )}
                  </IconButton>
                ),
                startAdornment: (
                  <IconButton onClick={() => setSearchTerm("")}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>

          {/* Create Button */}
          <Button
            onClick={handleOpenPostModal}
            variant="contained"
            elevation="0"
            sx={{
              textTransform: "none",
              borderRadius: 20,
              boxShadow: 0,
            }}
            startIcon={<AddIcon />}
          >
            {/* Create */}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Search Result Dropdown */}
      {filteredData.length > 0 && (
        <Box
          sx={{
            position: "sticky",
            // top: "70px",
            // left: "50%",
            // transform: "translateX(-50%)",
            width: "100%",
            // maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 4,
            zIndex: 9999,
            maxHeight: "auto",
            overflowY: "auto",
          }}
        >
          <List dense>
            {filteredData.map((item, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleNavigateToProfile(item)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box
                  component="img"
                  src={
                    item?.image || item?.user_image || "/default-profile.png"
                  }
                  alt={item?.username}
                  sx={{
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    objectFit: "cover",
                    mr: 2,
                  }}
                />
                <ListItemText
                  primary={item?.username}
                  secondary={item?.content}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default TopHeader;
