import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdatePasswordMutation,
  useGetVerificationTokenQuery,
} from "../../Features/authApi";

const PasswordUpdate = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { verification_string } = useParams();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const [updatePassword, { isLoading, isSuccess, error: updatePasswordError }] =
    useUpdatePasswordMutation();

  console.log("updatePasswordError", updatePasswordError);

  const verificationToken = localStorage.getItem("verification_token");

  const {
    data: verificationData,
    isLoading: verificationLoading,
    isError: verificationIsError,
    error,
  } = useGetVerificationTokenQuery(verification_string, {
    skip: !verification_string || !!verificationToken,
  });

  // Centralized token storage
  const saveVerificationToken = (token) =>
    localStorage.setItem("verification_token", token);
  const clearVerificationToken = () =>
    localStorage.removeItem("verification_token");

  useEffect(() => {
    if (isSuccess) {
      clearVerificationToken();
      navigate("/");
    }
    if (updatePasswordError?.status === 401) {
      showSnackbar("You are not authorized");
      clearVerificationToken();
      navigate("/");
    }
    if (updatePasswordError?.status === 400) {
      showSnackbar("Verification link expired");
      clearVerificationToken();
      navigate("/");
    }
    if (verificationData?.data?.verification_token) {
      saveVerificationToken(verificationData.data.verification_token);
    }
  }, [isSuccess, navigate, updatePasswordError, verificationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const showSnackbar = (msg, severity = "error") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = passwords;

    if (!newPassword || !confirmPassword)
      return showSnackbar("Both fields are required");
    if (newPassword.length < 6)
      return showSnackbar("Password must be at least 6 characters long");
    if (newPassword !== confirmPassword)
      return showSnackbar("Passwords do not match");

    // Send JSON instead of FormData (unless backend expects FormData)
    const formData = new FormData();
    formData.append("password", newPassword);
    formData.append("verification_string", verification_string);
    updatePassword({ formData });
    setPasswords({ newPassword: "", confirmPassword: "" });
  };

  const handleSnackbarClose = () => setOpenSnackbar(false);

  // Loading state for verification
  if (verificationLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state for invalid verification
  if (verificationIsError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Typography color="error" align="center">
          Invalid or expired verification link.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
        padding: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: theme.shadows[5],
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ marginBottom: 3, fontWeight: 600 }}
        >
          Update Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            placeholder="New Password"
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            margin="normal"
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ padding: 1.5, fontWeight: 600, mt: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PasswordUpdate;
