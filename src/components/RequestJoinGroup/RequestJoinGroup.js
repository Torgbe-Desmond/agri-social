import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
  useTheme,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import {
  useJoinGroupMutation,
  useRequestJoinGroupMutation,
} from "../../Features/messageApi";

const RequestJoinGroup = ({ post_owner, group_id }) => {
  const { userDetails } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [requestJoinGroup, { isLoading, error }] =
    useRequestJoinGroupMutation();

  const handleRequestJoinGroup = async () => {
    const formData = new FormData();
    formData.append("post_owner", post_owner);
    formData.append("group_id", group_id);
    formData.append("actor_id", userDetails?.id);
    const payload = await requestJoinGroup({ formData }).unwrap();
    setSuccessMessage(payload.message);
    dispatch(popComponent());
  };

  return (
    <Modal open={true}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "80%", sm: "70%", md: "500px" },
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
        }}
      >
        {error && (
          <Alert severity="error">
            {error?.data?.message ||
              "Something went wrong while creating the group."}
          </Alert>
        )}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          Request To Join Group
        </Typography>
        <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

        <Typography sx={{ mb: 2 }}>
          Click Join below if you are interested in joining this group. This
          will send a request to be allowed to join the group. You will receive
          a notification if request is allowed.
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "32px",
            }}
            disabled={isLoading}
            onClick={() => dispatch(popComponent())}
          >
            Cancel
          </Button>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Button
              disabled={isLoading}
              onClick={handleRequestJoinGroup}
              variant="contained"
              sx={{
                borderRadius: "32px",
                bgcolor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
                "&:hover": {
                  bgcolor: theme.palette.success.dark,
                },
              }}
            >
              Request To Join
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default RequestJoinGroup;
