import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import SidebarOption from "../SidebarOption/SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import OnlinePredictionOutlinedIcon from "@mui/icons-material/OnlinePredictionOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import GroupsIcon from "@mui/icons-material/Groups";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSocket } from "../Socket/Socket";
import ComponentStack from "../HandleStack/HandleStack";

function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:640px)");
  const unShowIcons = useMediaQuery("(max-width:1020px)");
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const socket = useSocket();
  const [notifyCounts, setNotifyCount] = useState(0);
  const reference_id = localStorage.getItem("reference_id");
  const navigate = useNavigate();

  useEffect(() => {
    const page = location.pathname.split("/")[2];
    setCurrentPage(page || "");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("reference_id");
    window.location.reload();
    navigate("/");
  };

  const handleDynamicView = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("DynamicView", {});
  };

  return (
    <Box
      className="sidebar"
      sx={{
        color: theme.palette.text.primary,
        padding: 2,
      }}
    >
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
        Icon={GroupsIcon}
        text="Group Chat"
        active={currentPage === "group-chat"}
        to={`/${reference_id}/group-chat`}
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
      <SidebarOption
        unShowIcons={unShowIcons}
        isMobile={isMobile}
        Icon={ProductionQuantityLimitsIcon}
        active={currentPage === "products"}
        text="Products"
        to={`/${reference_id}/products`}
      />

      <Button
        onClick={handleLogout}
        variant="outlined"
        fullWidth
        sx={{
          marginTop: 2,
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          borderRadius: "20px",
          "&:hover": {
            borderColor: theme.palette.primary.light,
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        Logout
      </Button>

      {/* <Button
        onClick={handleDynamicView}
        variant="outlined"
        fullWidth
        sx={{
          marginTop: 2,
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          borderRadius: "20px",
          "&:hover": {
            borderColor: theme.palette.primary.light,
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        Dynamic View
      </Button> */}
    </Box>
  );
}

export default Sidebar;
