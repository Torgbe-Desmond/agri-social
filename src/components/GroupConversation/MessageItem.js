import React from "react";
import { Box, Avatar } from "@mui/material";

function MessageItem({ msg, userDetails, systemPrefersDark }) {
  return (
    <Box
      display="flex"
      flexDirection={msg.sender_id === userDetails?.id ? "row-reverse" : "row"}
      alignItems="flex-start"
      p={1}
      gap={2}
      mb={2}
      className={`group__message ${msg.sender_id}`}
    >
      <Avatar
        src={msg?.profilePicture || msg?.user_image}
        alt={msg?.sender_id}
        sx={{ width: 40, height: 40 }}
      />

      {msg.image &&
        msg.image.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="user-upload"
            style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover" }}
          />
        ))}

      {msg.content && (
        <Box
          sx={{
            background: "#daf4ff",
            borderRadius: 2,
            p: 1.5,
            maxWidth: "70%",
            color: systemPrefersDark ? "#000" : "inherit",
          }}
          dangerouslySetInnerHTML={{ __html: msg.content }}
        />
      )}
    </Box>
  );
}

export default MessageItem;
