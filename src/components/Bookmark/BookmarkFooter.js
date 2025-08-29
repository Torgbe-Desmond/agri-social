import React from "react";
import { Box } from "@mui/material";
import PostStatusIcons from "../PostStatusIcons/PostStatusIcons";
import './Bookmark.css'

const BookmarkFooter = ({ actions }) => {
  return (
    <Box className="bookmark-footer">
      {actions.map((action, index) => {
        const a = {
          key: index,
          id: action?.id,
          variant: action?.location,
          to: action?.to,
          icon: action?.icon,
          count: action?.count,
          action: action?.action,
        };
        return <PostStatusIcons {...a} />;
      })}
    </Box>
  );
};

export default BookmarkFooter;
