import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Profile.css";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Saved from "../../components/Saved/Saved";
import Post from "../../components/Post/Post";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import PostHistory from "../../components/PostHistory/PostHistory";
import TwitterProfileUI from "../../components/TopProfile/TopProfile";
import MarketPlace from "../../components/MarketPlace/MarketPlace";
import UserProducts from "../../components/UserProducts/UserProducts";
import { clearProducts } from "../../Features/ProductSlice";
import { setScrolling } from "../../Features/StackSlice";
import Group from "../../components/Group/Group";
import Header from "../../components/Header/Header";
import { CustomTabs } from "../../components/CustomTab/CustomTabs";

function Profile() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const [scrolling, setScroll] = useState(0);

  // useEffect(() => {
  //   dispatch(setScrolling(true));
  //   return () => dispatch(setScrolling(false));
  // }, []);

  // alert(systemPrefersDark)

   
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const tabData = [
    {
      label: "Post",
      content: <PostHistory />,
    },
    {
      label: "Groups",
      content: <Group />,
    },
  ];

  <CustomTabs tabs={tabData} />;

  return (
    <Box className="profile">
      <Header
        setScroll={setScroll}
        userDetailComponent={<TwitterProfileUI />}
        children={<CustomTabs tabs={tabData} />}
      />
    </Box>
  );
}

export default Profile;
