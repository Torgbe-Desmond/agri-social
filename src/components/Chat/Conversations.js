import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Tabs, Tab, Box, useTheme } from "@mui/material";
import Messages from "../Messages/Messages";
import GroupMessages from "../Messages/GroupMessages";
import Header from "../Header/Header";
import Container from "../Container/Container";

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

  const tabData = [
    { label: "Messages", content: <Messages /> },
    // { label: "Group Messages", content: <GroupMessages /> },
  ];

  return (
    <Box className="conversations">
      <Box sx={{ width: "100%", p: 0 }}>
        <Container>
          <Tabs
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
            TabIndicatorProps={{
              style: { backgroundColor: theme.palette.primary.main },
            }}
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="conversations tabs"
          >
            {tabData.map((tab, index) => (
              <Tab
                sx={{
                  color:
                    tabIndex === index
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  fontWeight: tabIndex === index ? "bold" : "normal",
                }}
                key={index}
                label={tab.label}
              />
            ))}
          </Tabs>
        </Container>

        {tabData.map((tab, index) => (
          <CustomTabPanel key={index} value={tabIndex} index={index}>
            {tab.content}
          </CustomTabPanel>
        ))}
      </Box>
    </Box>
  );
}

export default Conversations;
