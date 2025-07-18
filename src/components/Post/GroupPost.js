import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

const GroupPost = ({ title, description, imageUrl, onJoin }) => {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={imageUrl}
        alt="Group cover"
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box textAlign="right">
          <Button
            variant="outlined"
            className="sidebar__tweet"
            color="primary"
            onClick={onJoin}
          >
            Join Group
          </Button>
        </Box>
      </CardContent>
    </Box>
  );
};

export default GroupPost;
