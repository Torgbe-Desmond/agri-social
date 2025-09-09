import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { useDeleteNotificationMutation } from "../../Features/notificationApi";
import { removeDeletedNotification } from "../../Features/notificationSlice";

const DeleteNotificationModal = ({ notification_id }) => {
  const theme = useTheme();
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
    <Modal open onClose={() => dispatch(popComponent())}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "80%", sm: "70%", md: 500 },
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          borderRadius: 2,
          p: 3,
        }}
      >
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
            sx={{ borderRadius: "32px" }}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: "32px",
              bgcolor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
              "&:hover": {
                bgcolor: theme.palette.error.dark,
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteNotificationModal;
