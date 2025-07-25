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
import StorefrontIcon from "@mui/icons-material/Storefront";
import TimelineIcon from "@mui/icons-material/Timeline";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

function Sidebar() {
  const isMobile = useMediaQuery("(max-width:640px)");
  const unShowIcons = useMediaQuery("(max-width:1020px)");
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const socket = useSocket();
  const [notifyCounts, setNotifyCount] = useState(0);
  const reference_id = localStorage.getItem("reference_id");

  // if (isMobile) return null;

  const handleOpenPostModal = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("CreatePost", {});
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("reference_id");
    window.location.reload();
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
    const page = location.pathname.split("/")[2];
    if (!page) {
      setCurrentPage("");
    } else {
      setCurrentPage(page);
    }
  }, [location]);

  return (
    <Box className="sidebar">
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
        to={`/${reference_id}`}
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={PermIdentityIcon}
        text="Profile"
        active={currentPage === "you"}
        to={`/${reference_id}/you`}
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={NotificationsNoneIcon}
        text="Notifications"
        active={currentPage === "notifications"}
        to={`/${reference_id}/notifications`}
        count={notifyCounts}
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={OnlinePredictionOutlinedIcon}
        text="Predictions"
        active={currentPage === "predictions"}
        to={`/${reference_id}/predictions`}
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={SmartToyOutlinedIcon}
        text="Farm Model"
        active={currentPage === "predict-disease"}
        to={`/${reference_id}/predict-disease`}
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={MailOutlineIcon}
        text="Messages"
        active={currentPage === "messages"}
        to={`/${reference_id}/messages`}
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={BookmarkBorderIcon}
        active={currentPage === "bookmarks"}
        text="Bookmarks"
        to={`/${reference_id}/bookmarks`}
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={VideocamOutlinedIcon}
        active={currentPage === "streams"}
        text="Streams"
        to={`/${reference_id}/streams`}
      />
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={StorefrontIcon}
        active={currentPage === "market-place"}
        text="Market Place"
        to={`/${reference_id}/market-place`}
      />
      {/* <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={TimelineIcon}
        active={currentPage === "post-history"}
        text="Posts"
        to={`/${reference_id}/post-history`}
      /> */}
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={ProductionQuantityLimitsIcon}
        active={currentPage === "products"}
        text="Products"
        to={`/${reference_id}/products`}
      />
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
      <Button
        onClick={handleLogout}
        variant="outlined"
        className="sidebar__tweet"
        fullWidth
      >
        Logout
      </Button>
    </Box>
  );
}

export default Sidebar;
