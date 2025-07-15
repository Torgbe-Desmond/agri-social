import React, { useEffect, useRef, useState } from "react";
import "./Sidebar.css";
import SidebarOption from "../SidebarOption/SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import OnlinePredictionOutlinedIcon from "@mui/icons-material/OnlinePredictionOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ComponentStack from "../HandleStack/HandleStack";
import { Box, Button, Stack, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../Socket/Socket";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";

function Sidebar() {
  const isMobile = useMediaQuery("(max-width:640px)");
  const unShowIcons = useMediaQuery("(max-width:1020px)");
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const socket = useSocket();
  const [notifyCounts, setNotifyCount] = useState(0);
  const { userDetails } = useSelector((state) => state.auth);

  // if (isMobile) return null;

  const handleOpenPostModal = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("CreatePost", {});
  };

  useEffect(() => {
    if (!socket) return;

    const handleNoficationCount = (data) => {
      const { notification_count } = data;
      console.log("notification_count", notification_count);

      setNotifyCount(notification_count);
    };

    socket.on("notification_count", handleNoficationCount);

    return () => {
      socket.off("notification_count", handleNoficationCount);
    };
  }, [socket]);

  useEffect(() => {
    const page = location.pathname.split("/")[1];
    setCurrentPage(page);
  }, [location]);

  return (
    <Box
     
      className="sidebar"
    >
      {/* <Box className="logo">
        <img
          src={require("../../assets/icons8-farmer-64.png")}
          alt="logo"
          width="35px"
          height="35px"
        />
      </Box> */}

      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        active={currentPage === ""}
        Icon={HomeIcon}
        text="Home"
        to="/"
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={PermIdentityIcon}
        text="Profile"
        active={currentPage === "you"}
        to="/you"
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={NotificationsNoneIcon}
        text="Notifications"
        active={currentPage === "notifications"}
        to="/notifications"
        count={notifyCounts}
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={OnlinePredictionOutlinedIcon}
        text="Predictions"
        active={currentPage === "predictions"}
        to="/predictions"
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={SmartToyOutlinedIcon}
        text="Farm Model"
        active={currentPage === "predict-disease"}
        to="/predict-disease"
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={MailOutlineIcon}
        text="Messages"
        active={currentPage === "messages"}
        to="/messages"
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={BookmarkBorderIcon}
        active={currentPage === "bookmarks"}
        text="Bookmarks"
        to="/bookmarks"
      />
      {/* <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={VideocamOutlinedIcon}
        active={currentPage === "streams"}
        text="Streams"
        to="/streams"
      /> */}
      {/* <SidebarOption isMobile={isMobile} Icon={MoreHorizIcon} text="More" /> */}

      {/* Button -> Tweet */}
      <Button
        onClick={handleOpenPostModal}
        variant="outlined"
        className="sidebar__tweet"
        fullWidth
      >
        Post
      </Button>
    </Box>
  );
}

export default Sidebar;
