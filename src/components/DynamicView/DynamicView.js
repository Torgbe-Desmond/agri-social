import React from "react";
import TabsLauncher from "./TabsLauncher";
import Window from "./Window";
import { Box, Modal, useTheme } from "@mui/material";

function DynamicView({ open, onClose }) {
  const theme = useTheme();

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="dynamic-view-modal"
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)", // blur background
          backgroundColor: "rgba(0,0,0,0.8)", // dark overlay
        },
      }}
      sx={{
        display: "flex",
        // margin:"auto",
        alignItems: "center", // vertical center
        justifyContent: "center", // horizontal center
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "100%",
          alignItems: "center", // vertical center
          justifyContent: "center", // horizontal center
          height: "100vh",
          boxShadow: 6,
          backgroundColor: theme.palette.background.paper + "CC", // frosted glass
          backdropFilter: "blur(8px)",
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <TabsLauncher />
        </Box>
      </Box>
    </Modal>
  );
}

export default DynamicView;
