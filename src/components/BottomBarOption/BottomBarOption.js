// BottomBarOption.js
import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { popComponent, setScrolling } from "../../Features/StackSlice";

function BottomBarOption({ Icon, text, to, active, count, onClick }) {
  const navigate = useNavigate();
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const dispatch = useDispatch();

  const valid = ["streams"];

  const handleClick = () => {
    if (onClick) return onClick();
    if (to) navigate(to);
    if (valid.includes(to.split("/")[1])) {
      dispatch(setScrolling(false));
    } else {
      dispatch(setScrolling(true));
    }
    dispatch(popComponent());
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        cursor: "pointer",
        color: active ? "#088A6A" : "inherit",

        // Translucent glass effect
        // backgroundColor: "rgba(255, 255, 255, 0.15)",
        // backdropFilter: "blur(12px)",
        // WebkitBackdropFilter: "blur(12px)",

        // Optional: smooth transition
        transition: "background-color 0.3s ease",
        // bgcolor: systemPrefersDark && "background.paper",
      }}
    >
      <Icon />
      {/* <Typography variant="caption">{text}</Typography> */}
      {count > 0 && (
        <Box
          sx={{
            color: "white",
            borderRadius: "50%",
            padding: "0 6px",
            fontSize: "10px",
            marginTop: "2px",
          }}
        >
          {count}
        </Box>
      )}
    </Box>
  );
}

export default BottomBarOption;
