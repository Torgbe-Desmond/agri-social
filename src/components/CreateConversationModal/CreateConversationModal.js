import React, { useEffect } from "react";
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
import { useError } from "../Errors/Errors";

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
  const { message, setMessage } = useError();
  const [createConversation, { isLoading, error }] =
    useCreateConversationMutation();

  console.log("error", error);
;

  useEffect(() => {
    if (error) {
      const errMsg =
        error?.data?.detail ||
        error?.error ||
        "Something went wrong while creating the conversation.";
      setMessage(errMsg);
    }
  }, [error, setMessage]);

  const handleCreateConversation = async () => {
    const formData = new FormData();
    const member_ids = [conversee?.id, userDetails?.id];
    member_ids.forEach((id) => formData.append("member_ids", id));
    const response = await createConversation({ formData }).unwrap();
    alert(response.message || "Conversation created");
    dispatch(popComponent());
  };

  return (
    <Modal open={true} onClose={() => dispatch(popComponent())}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Create Conversation
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography sx={{ mb: 2 }}>
          Create conversation with <strong>{conversee?.username}</strong>?
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
            variant="contained"
            onClick={handleCreateConversation}
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
