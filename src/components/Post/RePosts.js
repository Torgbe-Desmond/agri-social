import React from "react";
import { Avatar, Box, Tooltip } from "@mui/material";

// Example list of users who reposted
const users = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Dana", avatar: "https://i.pravatar.cc/150?img=4" },
];

function RePosts() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p:1
      }}
    >
      {users.map((user, index) => (
        <Tooltip key={user.id} title={user.name}>
          <Avatar
            alt={user.name}
            src={user.avatar}
            sx={{
              width: 40,
              height: 40,
              border: "2px solid white",
              zIndex: users.length - index,
              marginLeft: index === 0 ? 0 : "-1%",
              transition: "all 0.2s",
              "&:hover": {
                zIndex: 1000,
              },
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}

export default RePosts;
