import "./Widgets.css";
import {
  TwitterTimelineEmbed,
  TwitterShareButton,
  TwitterTweetEmbed,
} from "react-twitter-embed";
import SearchIcon from "@mui/icons-material/Search";
import { Box, List, ListItem, ListItemText, TextField } from "@mui/material";
import {
  clearSearch,
  searchUser,
  selectedItem,
} from "../../Features/SearchSlice";
import { popComponent } from "../../Features/StackSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const style = {
  // position: "absolute",
  // top: "30%",
  // right: "0",
  // transform: "translate(-50%, -50%)",
  width: "100%",
  // bgcolor: "background.paper",
  boxSizing: "border-box",
  // boxShadow: 1,
  gap: 1,
  // p: 1,

  maxHeight: "80vh",
  overflowY: "auto",
};

function Widgets() {

  return (
    <Box className="widgets">
     
    </Box>
  );
}

export default Widgets;
