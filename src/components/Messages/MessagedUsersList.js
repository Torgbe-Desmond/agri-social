import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { setConversaionId } from "../../Features/MessageSlice";
import { useDispatch } from "react-redux";

const MessagedUsersList = ({ users }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reference_id = localStorage.getItem("reference_id");

  const handleNavigateToChat = (user) => {
    navigate(
      `/${reference_id}/chat/${user?.conversation_id}/c/${user.reference_id}`
    );
  };

  return (
    <Card
      sx={{
        maxWidth: "100%",
        margin: "auto",
        p: 2,
        cursor: "pointer",
        borderRadius: "0px",
      }}
    >
      <List>
        {users &&
          users.map((user, index) => (
            <React.Fragment key={index}>
              <ListItem
                onClick={() => handleNavigateToChat(user)}
                alignItems="flex-start"
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
    </Card>
  );
};

export default MessagedUsersList;
