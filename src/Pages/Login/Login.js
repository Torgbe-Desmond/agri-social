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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../Features/authApi"; // <-- keep only this
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  // RTK Query mutation hook provides loading & error states
  const [login, { isLoading, error }] = useLoginMutation();

  console.log(error);

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
        console.log(data);
        if (data?.user?.reference_id) {
          localStorage.setItem("reference_id", data?.user?.reference_id);
          localStorage.setItem("access_token", data?.access_token);
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

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      // borderRadius: "40px",
      height: "40px",
    },
  };

  return (
    <div className="login-container">
      <Container maxWidth="sm">
        <Box mt={4} p={4}>
          <form
            className="login-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <TextField
              sx={textFieldStyles}
              placeholder="Email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              autoComplete="new-email"
              disabled={isLoading}
            />
            <TextField
              sx={textFieldStyles}
              placeholder="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              autoComplete="new-password"
              disabled={isLoading}
            />

            <Typography align="right" sx={{ margin: 2 }}>
              <Link to="/forgot-password">Forgot Password?</Link>
            </Typography>

            <Button
              type="submit"
              variant="outlined"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Box>

        <Typography align="center">
          <Link to="/register">Register</Link>
        </Typography>
      </Container>

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
    </div>
  );
};

export default Login;
