import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { useDeleteNotificationMutation } from "../../Features/notificationApi";
import { removeDeletedNotification } from "../../Features/notificationSlice";

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

const DeleteNotificationModal = ({ notification_id }) => {
  const dispatch = useDispatch();
  const [deleteNotification, { isLoading }] = useDeleteNotificationMutation();

  const handleDelete = async () => {
    try {
      const payload = await deleteNotification({
        notificationId: notification_id,
      }).unwrap();
      dispatch(removeDeletedNotification({ payload }));
      dispatch(popComponent());
    } catch (error) {
      console.error("Failed to delete notification", error);
      alert("Error deleting notification.");
    }
  };

  return (
    <Modal open={true} onClose={() => dispatch(popComponent())}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Delete Notification
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to delete this notification?
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
            onClick={handleDelete}
            variant="outlined"
            className="sidebar__tweet__contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteNotificationModal;
