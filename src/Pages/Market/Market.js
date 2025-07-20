import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Market.css";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import Feed from "../../components/Feed/Feed";
import MarketPlace from "../../components/MarketPlace/MarketPlace";
import { clearProducts } from "../../Features/ProductSlice";
import { setMainPathIndex } from "../../Features/StackSlice";

function Market() {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch();

  //   useEffect(() => {
  //     if (tabIMarketPlacendex === 0) {
  //       dispatch(clearProducts());
  //     }
  //   }, [tabIndex]);

  return (
    <Box className="market">
      <MarketPlace />
    </Box>
  );
}

export default Market;
