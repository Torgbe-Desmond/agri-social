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

const GroupMessageList = ({ groups }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: "100%", margin: "auto", p: 2, cursor: "pointer" ,borderRadius:"0px" }}>
      <List>
        {groups.length > 0 ?
          groups.map((group) => (
            <React.Fragment key={group?.conversation_id}>
              <ListItem
                onClick={() => navigate(`/group-chat/${group.conversation_id}`)}
                alignItems="flex-start"
              >
                {/* <ListItemAvatar>
                  <Avatar src={user.user_image}>
                    {!user.user_image && <PersonIcon />}
                  </Avatar>
                </ListItemAvatar> */}
                <ListItemText
                  primary={group?.group_name || "No name"}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {group?.last_message || "No messages yet."}
                      </Typography>
                      {group?.created_at && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          {new Date(group?.created_at).toLocaleString()}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          )):<p>No messages yet</p>}
      </List>
    </Card>
  );
};

export default GroupMessageList;
