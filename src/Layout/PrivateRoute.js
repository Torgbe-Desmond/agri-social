import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useGetUserQuery } from "../Features/userApi";

function PrivateRoute({ darkMode, systemPrefersDark, isMobile, isAuthenticated }) {
  const user_id = localStorage.getItem("access_token");
  const reference_id = localStorage.getItem("reference_id");

  // Fetch user with RTK Query if needed
  const { data: user, isLoading, isError } = useGetUserQuery(undefined, {
    skip: !user_id,
  });

  const sharedProps = {
    user_id,
    darkMode,
    systemPrefersDark,
    user,
  };

  if (!isAuthenticated) {
    // Could redirect here or return null if you handle auth elsewhere
    return null;
  }

  return (
    <Box
      sx={{
        borderLeft: 1,
        borderRight: 1,
        borderColor: "divider",
      }}
      className="private-route"
    >
      <Outlet context={sharedProps} />
    </Box>
  );
}

export default PrivateRoute;
