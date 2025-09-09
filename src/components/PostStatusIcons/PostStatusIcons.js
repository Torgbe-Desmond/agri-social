import React, { useEffect, useState } from "react";
import "./PostStatusIcons.css";
import { useNavigate } from "react-router-dom";
import { Box, Button, IconButton } from "@mui/material";

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
      {id === "deletePost" || id === "comment" ? (
        <IconButton
          onClick={handleFooterClick}
          color="primary"
          sx={{ gap: 1, fontSize: "small" }}
        >
          {icon}
          <span>{count}</span>
        </IconButton>
      ) : (
        <IconButton
          onClick={handleFooterClick}
          color="primary"
          disabled={disabled.id === id && disabled.isDisabled}
          sx={{ gap: 1, fontSize: "small", }}
        >
          {icon}
          <span>{count}</span>
        </IconButton>
      )}
    </Box>
  );
}

export default PostStatusIcons;
