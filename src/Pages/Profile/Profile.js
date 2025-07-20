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

function Profile() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();

  // useEffect(() => {
  //   dispatch(setScrolling(true));
  //   return () => dispatch(setScrolling(false));
  // }, []);

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

  return (
    <Box className="profile">
      <Box
        sx={{ bgcolor: systemPrefersDark && "background.paper" }}
        className={`profile__header`}
      >
        <h2>Profile</h2>
        <TwitterProfileUI />
      </Box>
      <Group />
    </Box>
  );
}

export default Profile;
