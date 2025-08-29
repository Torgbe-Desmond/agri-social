import React, { useState } from "react";
import "./Profile.css";
import { useDispatch } from "react-redux";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import PostHistory from "../../components/PostHistory/PostHistory";
import TwitterProfileUI from "../../components/TopProfile/TopProfile";
import Group from "../../components/Group/Group";
import Header from "../../components/Header/Header";
import Container from "../../components/Container/Container";
import ContainerTitle from "../../components/Container/ContainerTitle";
import ContainerHeader from "../../components/Container/ContainerHeader";

function CustomTabPanel({ children, value, index }) {
  return value === index && <Box sx={{ p: 2 }}>{children}</Box>;
}

function Profile() {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch();
  const theme = useTheme();

  const tabData = [
    // { label: "Post History", content: <PostHistory /> },
    // { label: "Groups", content: <Group /> },
  ];

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return <PostHistory />;
}

export default Profile;
