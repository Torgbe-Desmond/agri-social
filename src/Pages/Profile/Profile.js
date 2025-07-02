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

function Profile() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();

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
      <Box sx={{bgcolor: systemPrefersDark &&  "background.paper" }} className={`profile__header`}>
        <h2>Profile</h2>
        <TwitterProfileUI />
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: "50px",
          }}
        >
          <Tabs value={tabIndex} onChange={handleTabChange} sx={{}}>
            <Tab label="Posts" />
            {/* <Tab label="Replies" /> */}
            <Tab label="Products" />
          </Tabs>
        </Box>
      </Box>

      <Box>{tabIndex === 0 && <PostHistory />}</Box>
      <Box>{tabIndex === 1 && <UserProducts />}</Box>
    </Box>
  );
}

export default Profile;
