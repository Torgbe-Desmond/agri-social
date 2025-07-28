import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Main.css";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import Feed from "../../components/Feed/Feed";
import MarketPlace from "../../components/MarketPlace/MarketPlace";
import { clearProducts } from "../../Features/ProductSlice";
import { setMainPathIndex } from "../../Features/StackSlice";
import TopHeader from "../../components/TopHeader/TopHeader";

function Main() {
  const [tabIndex, setTabIndex] = useState(0);
  const { systemPrefersDark } = useOutletContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (tabIndex === 0) {
      dispatch(clearProducts());
    }
  }, [tabIndex]);

  return (
    <Box className="main">
      <TopHeader systemPrefersDark={systemPrefersDark} />
      <Feed />
    </Box>
  );
}

export default Main;
// data: Object { detail: "
//   Server error: (sqlalchemy.exc.InvalidRequestError) A value is required for bind parameter 'id'\n[SQL: \n               
//    INSERT INTO comment_likes (id, comment_id, user_id, created_at)\n                VALUES ($1, $2, $3, GETDATE())\n           
//    ]\n[parameters: [{'comment_id': '834fc081-3aab-4d2d-9485-a90d7c45b945', 'user_id': '24debfa6-2367-4bb8-8c4f-9f65d36ddef5'}]]\
//    n(Background on this error at: https://sqlalche.me/e/20/cd3x)" }