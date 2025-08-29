import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { useGetUserQuery } from "../Features/userApi";
import { addUser } from "../Features/AuthSlice";
import { useDispatch } from "react-redux";
import Sidebar from "../components/Sidebar/Sidebar";
import Widgets from "../components/Widgets/Widgets";

function PrivateRoute({
  darkMode,
  systemPrefersDark,
  isMobile,
  isAuthenticated,
  scrolling,
  setLearnLocation,
}) {
  const user_id = localStorage.getItem("access_token");
  const reference_id = localStorage.getItem("reference_id");
  const dispatch = useDispatch();
  const location = useLocation();

  // Fetch user with RTK Query if needed
  const { data: user, isError } = useGetUserQuery(undefined, {
    skip: !user_id,
  });

  console.log("location", location);

  useEffect(() => {
    setLearnLocation(location)
  }, []);

  useEffect(() => {
    dispatch(addUser(user));
  }, [user]);

  const sharedProps = {
    user_id,
    darkMode,
    location,
    systemPrefersDark,
    user,
  };

  if (!isAuthenticated) {
    // Could redirect here or return null if you handle auth elsewhere
    return null;
  }

  return (
    <Box className="private-route">
      {isAuthenticated && (isMobile ? scrolling && null : <Sidebar />)}
      <Box
        sx={{
          borderLeft: 1,
          borderRight: 1,
          borderColor: "divider",
        }}
        F
        className="private-main"
      >
        <Outlet context={sharedProps} />
      </Box>
      {isAuthenticated && <Widgets />}
    </Box>
  );
}

export default PrivateRoute;
