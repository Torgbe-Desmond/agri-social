import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Features/AuthSlice";
import { useSocket } from "../components/Socket/Socket";
import BottomBar from "../components/BottomBar/BottomBar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../App.css";
import { Box } from "@mui/material";

function PrivateRoute({
  darkMode,
  systemPrefersDark,
  isMobile,
  isAuthenticated,
}) {
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const user_id = localStorage.getItem("access_token");
  const reference_id = localStorage.getItem("reference_id");

  // useEffect(() => {
  //   navigate(`/${reference_id}`);
  // }, []);

  // Fetch user on mount
  useEffect(() => {
    if (user_id) {
      dispatch(getUser());
    }
  }, [dispatch, navigate, user_id]);

  const sharedProps = {
    user_id,
    darkMode,
    systemPrefersDark,
  };

  let component;
  if (isAuthenticated) {
    component = (
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

  return component;
}

export default PrivateRoute;
