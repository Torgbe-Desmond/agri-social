import React from "react";
import { IconButton, useTheme, Tooltip, Box } from "@mui/material";

function ContainerActions({ icons }) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 1 }}>
      {icons?.map((i, index) => (
        <Tooltip title={i.label || ""} key={i.id || index}>
          <IconButton
            onClick={() => i.action?.()}
            sx={{
              color: "inherit",
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            {i.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}

export default ContainerActions;
