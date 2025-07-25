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
// import PostHistory from "../../components/PostHistory/PostHistory";
// import TwitterProfileUI from "../../components/TopProfile/TopProfile";
// import MarketPlace from "../../components/MarketPlace/MarketPlace";
// import UserProducts from "../../components/UserProducts/UserProducts";
// import { clearProducts } from "../../Features/ProductSlice";

function Conversations() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const [scrolling, setScroll] = useState(0);

  // alert(systemPrefersDark)

  //   const lastPostRef = useCallback(
  //     (node) => {
  //       if (observer.current) observer.current.disconnect();
  //       observer.current = new IntersectionObserver((entries) => {
  //         if (entries[0].isIntersecting && hasMore) {
  //           setPageNumber((prev) => prev + 1);
  //         }
  //       });
  //       if (node) observer.current.observe(node);
  //     },
  //     [hasMore]
  //   );

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    dispatch(setScrolling(true));
    return () => dispatch(setScrolling(false));
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
