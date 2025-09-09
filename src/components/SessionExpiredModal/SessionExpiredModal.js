import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";

const SessionExpiredModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleLogout = async () => {
    navigate("/");
    dispatch(popComponent());
  };

  return (
    <Modal
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
      open={true}
    >
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
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          Session Expired
        </Typography>
        <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

        <Typography sx={{ mb: 2 }}>
          Please logout and login again to continue
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={handleLogout}
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
            Logout
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SessionExpiredModal;
