import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useSocket } from "../Socket/Socket";
import { useDispatch, useSelector } from "react-redux";
import NotificationStatus from "./NotificationStatus";

function NotificationFooter({ actions }) {
  const dispatch = useDispatch();

  return (
    <Box className="post__footer">
      {actions.map((action, index) => (
        <NotificationStatus
          key={index}
          icon={action.icon}
          action={action.action}
        />
      ))}
    </Box>
  );
}

export default NotificationFooter;
