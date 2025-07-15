import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Features/AuthSlice";
import { useSocket } from "../components/Socket/Socket";
import BottomBar from "../components/BottomBar/BottomBar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../App.css";
import { Box } from "@mui/material";

function PrivateRoute({ darkMode, systemPrefersDark, isMobile }) {
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const user_id = localStorage.getItem("cc_ft");

  // Fetch user on mount
  useEffect(() => {
    if (user_id) {
      dispatch(getUser({ user_id }));
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, user_id]);

  // Redirect to login if auth failed
  useEffect(() => {
    if (status === "failed") {
      navigate("/login");
    }
  }, [status, navigate]);

  // Emit user to socket
  useEffect(() => {
    if (socket && user_id) {
      socket.emit("user", { user_id });
    }
  }, [socket, user_id]);

  const sharedProps = {
    user_id,
    darkMode,
    systemPrefersDark,
  };
  const location = useLocation();

  return (
    <Box
      sx={{
        borderLeft: 1,
        borderRight: 1,
        borderColor: "divider",
      }}
      className={`private-route ${isMobile ? "" : ""}`}
    >
      {/* {isMobile ? <BottomBar /> : <Sidebar />} */}
      <Outlet context={sharedProps} />
    </Box>
  );
}

export default PrivateRoute;
