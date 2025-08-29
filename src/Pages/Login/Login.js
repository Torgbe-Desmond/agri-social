import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../Features/authApi";

const Login = () => {
  const theme = useTheme();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();
  console.log("error", error);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = credentials;

    if (!email) return showError("Email is required");
    if (!/\S+@\S+\.\S+/.test(email))
      return showError("Please enter a valid email");
    if (!password) return showError("Password is required");
    if (password.length < 6)
      return showError("Password must be at least 6 characters");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    login({ formData })
      .unwrap()
      .then((data) => {
        if (data?.user?.reference_id) {
          localStorage.setItem("reference_id", data.user.reference_id);
          localStorage.setItem("access_token", data.access_token);
          navigate(`/${data.user.reference_id}`);
          window.location.reload();
        }
      })
      .catch(() => showError("Login failed"));
  };

  const showError = (msg) => {
    setSnackbarMessage(msg);
    setOpenSnackbar(true);
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
        elevation={8}
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
          Login
        </Typography>

        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            placeholder="Email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {},
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            placeholder="Password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {},
            }}
          />

          <Typography align="right" sx={{ mt: 1, mb: 2 }}>
            <Link
              disabled={isLoading}
              to="/verify-email"
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
              }}
            >
              Forgot Password?
            </Link>
          </Typography>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ padding: 1.5, fontWeight: 600 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <Link
            disabled={isLoading}
            to="/register"
            style={{
              textDecoration: "none",
              color: theme.palette.primary.main,
            }}
          >
            Register
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

export default Login;



