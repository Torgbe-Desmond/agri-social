import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { useCreateConversationMutation } from "../../Features/messageApi";

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

  const [createConversation, { isLoading }] = useCreateConversationMutation();

  const handleCreateConversation = async () => {
    const formData = new FormData();
    const member_ids = [conversee?.id, userDetails?.id];
    member_ids.forEach((id) => formData.append("member_ids", id));

    try {
      const response = await createConversation({ formData }).unwrap();
      alert(response.message || "Conversation created");
      dispatch(popComponent());
    } catch (err) {
      console.error("Failed to create conversation", err);
      alert("Failed to create conversation");
    }
  };

  return (
    <Modal open={true} onClose={() => dispatch(popComponent())}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Create Conversation
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography sx={{ mb: 2 }}>
          Create group with <strong>{conversee?.username}</strong>?
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => dispatch(popComponent())}
            sx={{ borderRadius: "32px !important" }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleCreateConversation}
            className="sidebar__tweet__contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateConversationModal;
