import React from "react";
import "./SidebarOption.css";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Badge } from "@mui/material";

function SidebarOption({
  unShowIcons,
  isMobile,
  active,
  text,
  Icon,
  to,
  count,
}) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{ justifyContent: unShowIcons ? "center" : "" }}
      className={`sidebarOption ${active ? "sidebarOption--active" : ""} `}
      onClick={() => navigate(to)}
    >
      <h2>
        <Icon color="inherit" />
        {!unShowIcons && <>{text}</>}
      </h2>

      {typeof count === "number" && count > 0 && (
        <Box className="sidebarOption__count">{count}</Box>
      )}
    </Box>
  );
}

export default SidebarOption;
