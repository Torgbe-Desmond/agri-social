import React from "react";
import { Box, List, ListItem, ListItemText, useTheme } from "@mui/material";

const MentionedGroupsList = ({ groups }) => {
  const theme = useTheme();
  if (!groups?.length) return null;

  return (
    <List dense sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
      {groups.map((item, index) => (
        <ListItem
          key={index}
          sx={{
            cursor: "pointer",
            padding: 0,
          }}
        >
          {!item?.image && !item?.user_image ? (
            <Box
              sx={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                backgroundColor: theme.palette.secondary.main,
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              {item?.name?.[0]?.toUpperCase() || "?"}
            </Box>
          ) : (
            <Box
              component="img"
              src={item?.image || item?.user_image}
              alt={item?.name}
              sx={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                objectFit: "cover",
                mr: 2,
              }}
            />
          )}
          <ListItemText
            primary={item?.name}
            secondary={item?.content}
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 500,
              color: theme.palette.text.primary,
            }}
            secondaryTypographyProps={{
              color: theme.palette.text.secondary,
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default MentionedGroupsList;
