import { Box, useTheme } from "@mui/material";
import './Container.css'

const Container = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position:"static",
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
      className="container-header"
    >
      {children}
    </Box>
  );
};

export default Container;
