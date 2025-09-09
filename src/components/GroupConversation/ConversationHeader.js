import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupIcon from "@mui/icons-material/Group";

function ConversationHeader({ groupInfo, onBack }) {
  return (
    <Box className="group__header">
      <Typography sx={{ gap: 1 }} variant="h2">
        <ArrowBackIcon cursor="pointer" onClick={onBack} />

        <Avatar
          sx={{ width: 45, height: 45, border: "1px solid black" }}
          src={groupInfo?.group_image}
        >
          {!groupInfo?.group_image && <GroupIcon />}
        </Avatar>
      </Typography>
      <span>{groupInfo?.group_name}</span>
    </Box>
  );
}

export default ConversationHeader;
