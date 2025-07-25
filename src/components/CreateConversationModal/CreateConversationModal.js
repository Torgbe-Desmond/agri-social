import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { deletePost } from "../../Features/PostSlice";
import { createConversation } from "../../Features/MessageSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "80%", sm: "70%", md: "500px" },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
};

const CreateConversationModal = ({ conversee }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);
  const { createConversationStatus } = useSelector((state) => state.message);

  const handleCreateConversation = () => {
    const formData = new FormData();
    const member_ids = [conversee?.id, userDetails?.id];
    member_ids.forEach((member) => formData.append("member_ids", member));
    dispatch(createConversation({ formData }))
      .unwrap()
      .then((data) => {
        alert(data.message);
        dispatch(popComponent());
      });
  };

  return (
    <Modal open={true}>
      <Box sx={style}>
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          Create Conversation
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ mb: 2 }}>
          Create group with {conversee.username} ?
        </Typography>
        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "32px !important",
            }}
            color="secondary"
            onClick={() => dispatch(popComponent())}
          >
            Cancel
          </Button>
          {createConversationStatus === "loading" ? (
            <CircularProgress />
          ) : (
            <Button
              className="sidebar__tweet__contained"
              onClick={() => handleCreateConversation()}
              variant="outlined"
            >
              Create
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateConversationModal;
