// components/CustomTabs.js
import React, { useState } from "react";
import "./CustomTabs.css";
import { Box, Button, Paper } from "@mui/material";

export const CustomTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box className="custom-tabs">
      <Paper elevation={0} sx={{ borderRadius: "none" }} className="tab-header">
        {tabs.map((tab, index) => (
          <Button
            sx={{ borderRadius: "0px" }}
            key={index}
            className={`tab-button ${index === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab?.label}
          </Button>
        ))}
      </Paper>
      <Box className="tab-content">{tabs[activeTab].content}</Box>
    </Box>
  );
};
