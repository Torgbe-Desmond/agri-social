import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Features/AuthSlice";
import { useSocket } from "../components/Socket/Socket";
import BottomBar from "../components/BottomBar/BottomBar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../App.css";

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

  return (
    <div className={`private-route ${isMobile ? "mobile_bottom_padding" : ""}`}>
      {/* {isMobile ? <BottomBar /> : <Sidebar />} */}
      <Outlet context={sharedProps} />
    </div>
  );
}

export default PrivateRoute;
