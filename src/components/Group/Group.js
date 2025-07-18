import React from "react";
import { Box } from "@mui/material";
import GroupPost from "../Post/GroupPost";

const Group = () => {
  const handleJoin = () => {
    alert("You joined the group!");
  };

  const groups = [
    {
      id: 1,
      title: "React Developers",
      description: "A group for sharing React tips, tricks, and tutorials.",
      imageUrl: "https://source.unsplash.com/400x180/?reactjs",
    },
    {
      id: 2,
      title: "Node.js Enthusiasts",
      description: "Backend developers who love Node.js and Express.",
      imageUrl: "https://source.unsplash.com/400x180/?nodejs",
    },
    {
      id: 3,
      title: "UI/UX Designers",
      description: "People who love design systems and user experiences.",
      imageUrl: "https://source.unsplash.com/400x180/?design",
    },
    {
      id: 4,
      title: "Data Scientists",
      description: "ML, AI, and data lovers gather here.",
      imageUrl: "https://source.unsplash.com/400x180/?data",
    },
  ];
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      {groups.map((group) => (
        <Grid item xs={12} sm={6} md={4} key={group.id}>
          <GroupPost
            title={group.title}
            description={group.description}
            imageUrl={group.imageUrl}
            onJoin={() => handleJoin(group.title)}
          />
        </Grid>
      ))}
    </Box>
  );
};

export default Group;
