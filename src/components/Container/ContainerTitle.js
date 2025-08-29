import { Typography } from "@mui/material";
import "./Container.css";

const ContainerTitle = ({ title }) => {
  return (
    <Typography
      variant="h5"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1,
      }}
    >
      {title}
    </Typography>
  );
};

export default ContainerTitle;
