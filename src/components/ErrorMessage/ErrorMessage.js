import { Alert, Snackbar } from "@mui/material";
import React from "react";

function ErrorMessage(errorMessage, handleErrorSnackbarClose, duration) {
  return (
    <div>
      {/* Error Message Snackbar */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={duration}
        onClose={handleErrorSnackbarClose}
      >
        <Alert onClose={handleErrorSnackbarClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ErrorMessage;
