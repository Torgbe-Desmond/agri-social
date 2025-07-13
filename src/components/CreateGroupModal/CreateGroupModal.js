import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Modal,
  Paper,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { createGroup } from "../../Features/MessageSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

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
    formData.append("is_group", "1");

    dispatch(createGroup({ formData }));
    dispatch(popComponent());
  };

  const handleCancel = () => {
    dispatch(popComponent());
  };

  return (
    <Modal open={true} onClose={handleCancel}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Create Group
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
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

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          alignItems="flex-end"
          mt={3}
        >
          <Button
            onClick={handleCancel}
            variant="outlined"
            color="secondary"
            className="sidebar__tweet__outlined"
            sx={{ borderRadius: "32px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            className="sidebar__tweet"
            disabled={!groupName.trim()}
            sx={{ borderRadius: "32px" }}
          >
            Create
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateGroupModal;
