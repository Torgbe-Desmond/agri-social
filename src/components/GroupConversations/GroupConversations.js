import React, { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentlyConversingGroupInformation } from "../../Features/MessageSlice";

const GroupConversations = ({ groups }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reference_id = localStorage.getItem("reference_id");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleMoreClick = (event, group) => {
    // event.stopPropagation(); // Prevent list item click
    // setAnchorEl(event.currentTarget);
    // setSelectedGroup(group);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  const handleDeleteGroup = () => {
    // if (selectedGroup) {
    //   console.log("Deleting group:", selectedGroup);
    //   // TODO: Implement actual delete logic here
    //   handleCloseMenu();
    // }
  };

  console.log("groups", groups);

  const handleNavigateToGroupChat = (group) => {
    dispatch(setCurrentlyConversingGroupInformation(group));
    navigate(`/${reference_id}/group-chat/${group.conversation_id}`);
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        borderRadius: "0px",
        bgcolor: "background.color",
      }}
    >
      <List>
        {groups &&
          groups.map((group, index) => (
            <React.Fragment key={index}>
              <ListItem
                onClick={() => handleNavigateToGroupChat(group)}
                alignItems="flex-start"
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(e) => handleMoreClick(e, group)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={group.group_image}>
                    {!group.group_image && <GroupIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={group.group_name}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {group.last_message || "No messages yet."}
                      </Typography>
                      {group.created_at && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          {new Date(group.created_at).toLocaleString()}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
      </List>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleDeleteGroup}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default GroupConversations;
