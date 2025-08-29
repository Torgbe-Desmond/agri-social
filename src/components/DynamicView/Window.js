import React from "react";
import { useSelector } from "react-redux";
import { Grid, Box, useTheme } from "@mui/material";
import { _componentMap } from "../HandleStack/ComponentMap";

function Window() {
  const theme = useTheme();
  const stack = useSelector((state) => state.stack); // your stack slice

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2} columns={{ xs: 1, sm: 2 }}>
        {stack.length > 0 &&
          stack?.map((item, index) => {
            const Component = _componentMap[item?.id];
            return (
              <Grid
                item
                xs={1}
                sm={1}
                key={index}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  boxShadow: theme.shadows[2],
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    backgroundColor: theme.palette.grey[900],
                    color: theme.palette.common.white,
                    px: 1,
                    py: 0.5,
                    fontWeight: "bold",
                  }}
                >
                  {item?.props?.title || item?.id}
                </Box>

                {/* Content */}
                <Box sx={{ p: 2 }}>
                  {Component && <Component {...item?.props} />}
                </Box>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
}

export default Window;
