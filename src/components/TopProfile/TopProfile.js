import React from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useDispatch, useSelector } from "react-redux";
import ComponentStack from "../HandleStack/HandleStack";
import { useOutletContext } from "react-router-dom";
import { follow } from "../../Features/AuthSlice";

const TwitterProfileUI = () => {
  const { userDetails, userDetailsStatus } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { darkMode, systemPrefersDark } = useOutletContext();

  const handleEditProfile = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("Profile", {
      user: userDetails,
      systemPrefersDark,
      darkMode,
    });
  };

  if (userDetailsStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  return (
    <Box
      sx={{
        background: "inherit",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "flex-start",
        pt:1,
        pb:1
      }}
    >
      <Box sx={{ position: "relative", px: 2, pb: 0 }}>
        <Avatar
          src={userDetails?.user_image}
          sx={{
            width: 100,
            height: 100,
            border: "4px solid black",
          }}
        />
      </Box>

      <Box
        sx={{
          // px: 2,
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >
        {/* <Typography variant="h6" fontWeight="bold">
          {userDetails?.username}
        </Typography> */}
        <Typography color="gray">@{userDetails?.username}</Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 1,
            color: "gray",
          }}
        >
          {userDetails?.city && (
            <>
              <LocationOnIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{userDetails?.city}</Typography>
            </>
          )}{" "}
          <CalendarTodayIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2">
            Joined{" "}
            {new Date(userDetails?.created_at).toLocaleString("default", {
              month: "long",
            })}{" "}
            {new Date(userDetails?.created_at).getFullYear()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3, mt: 1, color: "gray", pl: 0.5 }}>
          <Typography variant="body2">
            <strong>{userDetails?.following}</strong> Following
          </Typography>
          <Typography variant="body2">
            <strong>{userDetails?.followers}</strong> Followers
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
          <Button
            onClick={handleEditProfile}
            variant="outlined"
            sx={{
              borderRadius: 5,
            }}
          >
            Edit profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TwitterProfileUI;
