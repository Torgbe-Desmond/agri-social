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

const AcceptJoinGroupRequest = ({ groups, mentions }) => {
  const [successMessage, setSuccessMessage] = useState();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [joinGroup, { isLoading, error }] = useJoinGroupMutation();

  console.log("error", error);

  const handleJoinGroup = async () => {
    const formData = new FormData();
    formData.append("conversation_id", groups[0]?.id);
    formData.append("user_id", mentions[0]?.id);
    const payload = await joinGroup({ formData }).unwrap();
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
          Accept Join Group Request
        </Typography>
        <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

        <Typography sx={{ mb: 2 }}>
          Click Join below if you are interested allowing{" "}
          {mentions[0]?.username} to join {groups[0]?.name}.
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
              onClick={handleJoinGroup}
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
              Accept Request
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AcceptJoinGroupRequest;
