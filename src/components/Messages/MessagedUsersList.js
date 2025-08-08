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
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setConversaionId,
  setCurrentlyConversingUserInformation,
} from "../../Features/MessageSlice";

const MessagedUsersList = ({ users }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reference_id = localStorage.getItem("reference_id");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleMoreClick = (event, user) => {
    event.stopPropagation(); // Prevent list item click
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      console.log("Deleting user:", selectedUser);
      // TODO: Implement actual delete logic here
      handleCloseMenu();
    }
  };

  const handleNavigateToChat = (user) => {
    dispatch(setCurrentlyConversingUserInformation(user));
    navigate(
      `/${reference_id}/chat/${user?.conversation_id}/c/${user.reference_id}`
    );
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        margin: "auto",
        borderRadius: "0px",
        bgcolor: "background.color",
      }}
    >
      <List>
        {users &&
          users.map((user, index) => (
            <React.Fragment key={index}>
              <ListItem
                onClick={() => handleNavigateToChat(user)}
                alignItems="flex-start"
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(e) => handleMoreClick(e, user)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={user.user_image}>
                    {!user.user_image && <PersonIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {user.last_message || "No messages yet."}
                      </Typography>
                      {user.created_at && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          {new Date(user.created_at).toLocaleString()}
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
        <MenuItem onClick={handleDeleteUser}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default MessagedUsersList;
