import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Main.css";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Saved from "../../components/Saved/Saved";
import Post from "../../components/Post/Post";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import PostHistory from "../../components/PostHistory/PostHistory";
import TwitterProfileUI from "../../components/TopProfile/TopProfile";
import Feed from "../../components/Feed/Feed";
import MarketPlace from "../../components/MarketPlace/MarketPlace";
import { clearProducts } from "../../Features/ProductSlice";
import { setMainPathIndex } from "../../Features/StackSlice";

function Main() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const { mainPathIndex } = useSelector((state) => state.stack);

  useEffect(() => {
    if (tabIndex === 0) {
      dispatch(clearProducts());
    }
  }, [tabIndex]);

  const handleTabChange = (event, newValue) => {
    dispatch(setMainPathIndex(newValue));
  };

  return (
    <Box className="main">
      <Box
        sx={{ bgcolor: systemPrefersDark && "background.paper" }}
        className={`main__header`}
      >
        <Box
          sx={{
            display:"none",
            borderBottom: 0.5,
            borderColor: "divider",
            display: "flex",
            width: "100%",
            gap: "100px",
            justifyContent: "space-evenly",
            alignItems: "flex-start",
          }}
        >
          <Tabs
            textColor="inherit"
            value={mainPathIndex}
            onChange={handleTabChange}
            // sx={{ padding: "0px", background:"red" }}
          >
            <Tab label="Home" />
            <Tab label="Market Place" />
          </Tabs>
        </Box>
      </Box>
      <Box>{mainPathIndex === 0 && <Feed />}</Box>
      <Box>{mainPathIndex === 1 && <MarketPlace />}</Box>
    </Box>
  );
}

export default Main;
