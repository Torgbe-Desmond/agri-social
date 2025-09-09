import React from "react";
import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useDispatch, useSelector } from "react-redux";
import ComponentStack from "../HandleStack/HandleStack";

const ContainerHeader = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { userDetails: user } = useSelector((state) => state.auth);

  const handleEditProfile = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("Profile", { user });
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        gap: 2,
        p: 2,
      }}
    >
      {user && (
        <>
          {/* Avatar */}
          <Avatar
            src={user?.user_image}
            alt={user?.username}
            sx={{
              width: 96,
              height: 96,
              border: `3px solid ${theme.palette.background.default}`,
              boxShadow: theme.shadows[2],
            }}
          />

          {/* User Info */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              @{user?.username}
            </Typography>

            {/* Location + Join Date */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mt: 1,
                flexWrap: "wrap",
                color: "text.secondary",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">
                  Joined{" "}
                  {new Date(user?.created_at).toLocaleString("default", {
                    month: "long",
                  })}{" "}
                  {new Date(user?.created_at).getFullYear()}
                </Typography>
              </Box>
              {user?.city && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 0.5,
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{user.city}</Typography>
                </Box>
              )}
            </Box>

            {/* Followers / Following */}
            <Box
              sx={{ display: "flex", gap: 3, mt: 1, color: "text.secondary" }}
            >
              <Typography variant="body2">
                <strong>{user?.following}</strong> Following
              </Typography>
              <Typography variant="body2">
                <strong>{user?.followers}</strong> Followers
              </Typography>
            </Box>

            {/* Edit button */}
            <Box sx={{ mt: 1 }}>
              <Button
                onClick={handleEditProfile}
                variant="outlined"
                sx={{
                  borderRadius: "9999px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                  py: 0.5,
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ContainerHeader;
