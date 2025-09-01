import { Typography } from "@mui/material";
import "./Container.css";

const ContainerDescription = ({ description }) => {
  return (
    <Typography
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1,
      }}
    >
      {description}
    </Typography>
  );
};

export default ContainerDescription;
