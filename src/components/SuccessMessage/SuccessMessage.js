import { Alert, Snackbar } from "@mui/material";
import React from "react";
import "./SuccessMessage.css";

function SuccessMessage({ successMessage, handleSnackbarClose, duration }) {
  return (
    <Snackbar
      open={Boolean(successMessage)}
      autoHideDuration={duration}
      onClose={handleSnackbarClose}
    >
      <Alert onClose={handleSnackbarClose} severity="success">
        {successMessage}
      </Alert>
    </Snackbar>
  );
}

export default SuccessMessage;
