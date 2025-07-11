import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { createGroup } from "../../Features/MessageSlice";

const CreateGroupModal = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const handleCreate = () => {
    if (!groupName.trim()) return;

    const formData = new FormData();
    formData.append("name", groupName.trim());
    // formData.append("description", description.trim());
    formData.append("sender_id", localStorage.getItem("cc_ft"));
    formData.append("is_group", "1"); // Set to 1 for group

    dispatch(createGroup({ formData }));
    dispatch(popComponent()); // Close modal after creating
  };

  const handleCancel = () => {
    dispatch(popComponent());
  };

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>Create Group</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="error">
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          disabled={!groupName.trim()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroupModal;
