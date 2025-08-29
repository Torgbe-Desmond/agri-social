import React, { useEffect, useState } from "react";
import "./PostStatusIcons.css";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

function PostStatusIcons({
  id,
  icon,
  count,
  to,
  action,
  post_id,
  status,
  isLoadingSaved,
  isLoadingLiked,
}) {
  const [disabled, setDisabled] = useState({
    isDisabled: false,
    id: "",
  });
  const navigate = useNavigate();

  const handleFooterClick = () => {
    setDisabled({
      isDisabled: true,
      id,
    });

    if (to) navigate(to);
    if (action) action();
  };

  useEffect(() => {
    return () => {
      setTimeout(() => setDisabled({ isDisabled: false, id: "" }), 2000);
    };
  }, [isLoadingSaved, isLoadingLiked]);

  return (
    <Box className="post-status-icon" id={`${id}-${post_id}`}>
      <Button
        onClick={handleFooterClick}
        variant="outlined"
        color="primary"
        disabled={disabled.id === id && disabled.isDisabled}
        startIcon={icon}
        sx={{
          textTransform: "none",
          borderRadius: 20,
          borderColor: "divider",
        }}
      >
        {count}
      </Button>
    </Box>
  );
}

export default PostStatusIcons;
