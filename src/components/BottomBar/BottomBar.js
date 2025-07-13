import React, { useState } from "react";
import {
  BottomNavigation,
  Paper,
  Box,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BottomBarOption from "../BottomBarOption/BottomBarOption";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import OnlinePredictionOutlinedIcon from "@mui/icons-material/OnlinePredictionOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";

import { useLocation } from "react-router-dom";

const BottomBar = ({ notifyCounts = 0 }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1];
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const toggleDrawer = (value) => () => setOpenDrawer(value);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1400,
          borderTop: 0.5,
          borderColor: "divider",
          bgcolor: systemPrefersDark ? "background.paper" : "#FFF",
        }}
        elevation={0}
      >
        <BottomNavigation
          sx={{
            // backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            transition: "background-color 0.3s ease",
          }}
        >
          <BottomBarOption Icon={HomeIcon} to="/" active={currentPage === ""} />
          <BottomBarOption
            Icon={PermIdentityIcon}
            to="/you"
            active={currentPage === "you"}
          />
          <BottomBarOption
            Icon={NotificationsNoneIcon}
            to="/notifications"
            count={notifyCounts}
            active={currentPage === "notifications"}
          />
          <BottomBarOption
            Icon={MailOutlineIcon}
            to="/messages"
            active={currentPage === "messages"}
          />
          <BottomBarOption
            Icon={MoreHorizIcon}
            to="#"
            active={false}
            onClick={toggleDrawer(true)} // ✅ wrapped in function
          />
        </BottomNavigation>
      </Box>

      {/* Uncomment to use SwipeableDrawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 10,
            display: "flex",
            // background: systemPrefersDark ? "background.paper" : "#FFF",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <BottomBarOption
            Icon={BookmarkBorderIcon}
            text="Bookmarks"
            to="/bookmarks"
            active={currentPage === "bookmarks"}
          />
          <BottomBarOption
            Icon={OnlinePredictionOutlinedIcon}
            text="Predictions"
            to="/predictions"
            active={currentPage === "predictions"}
          />
          <BottomBarOption
            Icon={SmartToyOutlinedIcon}
            text="FarmBot"
            to="/predict-disease"
            active={currentPage === "predict-disease"}
          />
          <BottomBarOption
            Icon={VideocamOutlinedIcon}
            text="Streams"
            to="/streams"
            active={currentPage === "streams"}
          />
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default BottomBar;
