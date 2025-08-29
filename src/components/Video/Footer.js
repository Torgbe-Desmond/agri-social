import React from "react";
import { Box } from "@mui/material";
import "./Video.css";
import VideoStatusIcons from "../PostStatusIcons/VideoStatusIcons";

function Footer({ actions }) {
  return (
    <Box className="footer">
      {actions.map((action, index) => {
        const a = {
          id: action?.id,
          variant: action?.location,
          to: action?.to,
          icon: action?.icon,
          count: action?.count,
          action: action?.action,
        };
        return (
          <Box key={index}>
            <VideoStatusIcons {...a} />
          </Box>
        );
      })}
    </Box>
  );
}

export default Footer;
