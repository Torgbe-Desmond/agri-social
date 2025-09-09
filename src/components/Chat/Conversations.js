import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Tabs, Tab, Box, useTheme } from "@mui/material";
import Messages from "../Messages/Messages";
import GroupMessages from "../Messages/GroupMessages";
import Header from "../Header/Header";
import Container from "../Container/Container";
import { updateUsersInfo } from "../../Features/MessageSlice";
import ContainerTitle from "../Container/ContainerTitle";

function CustomTabPanel({ children, value, index }) {
  return value === index && <Box sx={{ p: 2 }}>{children}</Box>;
}

function Conversations() {
  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box className="conversations">
      <Box sx={{ width: "100%", p: 0 }}>
        <Messages />
      </Box>
    </Box>
  );
}

export default Conversations;
