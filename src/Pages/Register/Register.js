import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../Features/authApi";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const reference_Id = localStorage.getItem("reference_id");

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [register, { isLoading, error, data }] = useRegisterMutation();

  useEffect(() => {
    if (data && reference_Id) {
      navigate(`/${reference_Id}/directories`);
    }
  }, [data, reference_Id, navigate]);

  useEffect(() => {
    if (error) {
      const errorMsg =
        error?.data?.message || error?.message || "Registration failed";
      setSnackbarMessage(errorMsg);
      setOpenSnackbar(true);
    }
  }, [error]);

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") setConfirmPassword(value);
    else setUserInfo((prev) => ({ ...prev, [name]: value }));
    setPasswordError(false);
  };

  const showError = (msg) => {
    setSnackbarMessage(msg);
    setOpenSnackbar(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password } = userInfo;

    if (!username || !email || !password || !confirmPassword)
      return showError("Please fill in all fields.");
    if (password !== confirmPassword) {
      setPasswordError(true);
      return showError("Passwords don't match.");
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    register({ formData })
      .unwrap()
      .then(() => {
        navigate(`/`);
        window.location.reload();
      })
      .catch(() => {
        // Error is handled by useEffect
      });
  };

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
        elevation={0}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: theme.shadows[0],
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ marginBottom: 3, fontWeight: 600 }}
        >
          Register
        </Typography>

        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            placeholder="Username"
            name="username"
            value={userInfo.username}
            onChange={handleChange}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            margin="normal"
            placeholder="Email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            margin="normal"
            placeholder="Password"
            type="password"
            name="password"
            value={userInfo.password}
            onChange={handleChange}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            margin="normal"
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            error={passwordError}
            helperText={passwordError ? "Passwords don't match" : ""}
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
              "Register"
            )}
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: theme.palette.primary.main,
            }}
          >
            Login
          </Link>
        </Typography>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
