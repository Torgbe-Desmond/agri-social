import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../App.css";
import { getUser } from "../Features/AuthSlice";
import { useDispatch } from "react-redux";
import { useSocket } from "../components/Socket/Socket";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import BottomBar from "../components/BottomBar/BottomBar";
import Sidebar from "../components/Sidebar/Sidebar";
import Widgets from "../components/Widgets/Widgets";

function PrivateRoute({
  isAuthenticated,
  darkMode,
  systemPrefersDark,
  isMobile,
}) {
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigate = useNavigate();


  // useEffect(() => {
  //   if (!socket) return;
  //   socket.emit("user", { user_id: localStorage.getItem("cc_ft") });
  // }, [socket]);

  useEffect(() => {
    dispatch(getUser({ user_id: localStorage.getItem("cc_ft") }));
  }, []);

  const sharedProps = {
    user_id: localStorage.getItem("cc_ft"),
    darkMode,
    systemPrefersDark,
  };
  return (
    <div className={`private-route ${isMobile && "mobile_bottom_padding"}`}>
      {/* <CssBaseline /> */}
      {/* {isMobile ? <BottomBar /> : <Sidebar />} */}
      <Outlet context={sharedProps} />
      {/* <Widgets /> */}
    </div>
  );
}

export default PrivateRoute;
