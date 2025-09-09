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

const ActionModal = ({
  open = true,
  title = "Confirm",
  message = "Are you sure?",
  actions = [], // array of { label, onClick, color, variant, loading }
  onClose,
  props: {},
}) => {
  const theme = useTheme();

  return (
    <Modal open={open} onClose={onClose}>
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
          {title}
        </Typography>
        <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

        <Typography sx={{ mb: 2 }}>{message}</Typography>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          {actions.map((action, idx) =>
            action.loading ? (
              <CircularProgress size={24} key={idx} />
            ) : (
              <Button
                key={idx}
                variant={action.variant}
                onClick={action.onClick}
                disabled={action.disabled}
                sx={{ borderRadius: "32px" }}
              >
                {action.label}
              </Button>
            )
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ActionModal;
