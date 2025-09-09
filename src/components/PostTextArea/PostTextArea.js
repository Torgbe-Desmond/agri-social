import React from "react";
import { TextField, useTheme } from "@mui/material";

const PostTextArea = ({ content, setContent, setMentions, setGroups, setLinks, isLoading }) => {
  const theme = useTheme();

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);

    // Mentions: @username
    const foundMentions = text.match(/@\w+/g) || [];
    // Groups: #groupname
    const foundGroups = text.match(/#\w+/g) || [];
    // Links: simple URL regex
    const foundLinks = text.match(/https?:\/\/[^\s]+/g) || [];

    setMentions(foundMentions.map((m) => m.slice(1)));
    setGroups(foundGroups.map((g) => g.slice(1)));
    setLinks(foundLinks);
  };

  return (
    <TextField
      disabled={isLoading}
      multiline
      rows={4}
      fullWidth
      placeholder="What's on your mind? Use @username for users and #group for groups"
      variant="outlined"
      value={content}
      onChange={handleContentChange}
      sx={{
        backgroundColor: theme.palette.background.default,
        borderRadius: 2,
        mb: 2,
      }}
    />
  );
};

export default PostTextArea;
