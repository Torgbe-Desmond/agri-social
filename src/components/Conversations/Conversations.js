import React, { useCallback, useEffect, useRef, useState } from "react";
// import "./Profile.css";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import Saved from "../../components/Saved/Saved";
// import Post from "../../components/Post/Post";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import Messages from "../Messages/Messages";
import GroupMessages from "../Messages/GroupMessages";
import { setScrolling } from "../../Features/StackSlice";
import Header from "../Header/Header";
import { CustomTabs } from "../CustomTab/CustomTabs";

function Conversations() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const [scrolling, setScroll] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    // dispatch(setScrolling(true));
    // return () => dispatch(setScrolling(false));
  }, []);

  const tabData = [
    {
      label: "Messages",
      content: <Messages />,
    },
    {
      label: "Group Messages",
      content: <GroupMessages />,
    },
  ];

  <CustomTabs tabs={tabData} />;

  return (
    <Box className="profile">
      <Header setScroll={setScroll} children={<CustomTabs tabs={tabData} />} />
    </Box>
  );
}

export default Conversations;
