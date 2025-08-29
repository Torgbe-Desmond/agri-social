import React from "react";
import "./SidebarOption.css";
import { useNavigate } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";

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
  const theme = useTheme(); // 👈 use theme colors

  return (
    <Box
      sx={{
        justifyContent: unShowIcons ? "center" : "",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          borderRadius: "30px",
          color: theme.palette.primary.main,
          transition: "color 100ms ease-out",
        },
        color: active ? theme.palette.primary.main : theme.palette.text.primary,
      }}
      className={`sidebarOption ${active ? "sidebarOption--active" : ""}`}
      onClick={() => navigate(to)}
    >
      <Typography variant="h2">
        <Icon color="inherit" />
        {!unShowIcons && <>{text}</>}
      </Typography>

      {typeof count === "number" && count > 0 && (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            padding: "2px 8px",
            borderRadius: "12px",
            fontWeight: "bold",
          }}
          className="sidebarOption__count"
        >
          {count}
        </Box>
      )}
    </Box>
  );
}

export default SidebarOption;
