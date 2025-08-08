import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Main.css";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import Feed from "../../components/Feed/Feed";
import MarketPlace from "../../components/MarketPlace/MarketPlace";
import { setMainPathIndex } from "../../Features/StackSlice";
import TopHeader from "../../components/TopHeader/TopHeader";

function Main() {
  const { systemPrefersDark } = useOutletContext();

  return (
    <Box className="main">
      <TopHeader systemPrefersDark={systemPrefersDark} />
      <Feed />
    </Box>
  );
}

export default Main;
