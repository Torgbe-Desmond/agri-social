import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

function Success({ isSuccess }) {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setOpenSnackbar(true);
    }
  }, [isSuccess]);

  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={() => setOpenSnackbar(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
        Action completed successfully!
      </Alert>
    </Snackbar>
  );
}

export default Success;
