import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  useMediaQuery,
  Paper,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../Features/authApi";

const ForgotPassword = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [forgotPassword, { isLoading, isSuccess, isError, error }] =
    useForgotPasswordMutation();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const formData = new FormData();
      formData.append("email", email);
      await forgotPassword({ formData }).unwrap();
    } catch (err) {
      console.error("Failed to send forgot password request:", err);
    }
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
          boxShadow: theme.shadows[5],
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ marginBottom: 3, fontWeight: 600 }}
        >
          Forgot Password ?
        </Typography>

        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            fullWidth
            disabled={isLoading}
            margin="normal"
          />

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
              "Send Reset Link"
            )}
          </Button>
        </form>

        {isSuccess && (
          <Typography color="success.main" mt={2}>
            Check your email for the password reset link.
          </Typography>
        )}

        {isError && (
          <Typography color="error.main" mt={2}>
            {error?.data?.message || "Something went wrong."}
          </Typography>
        )}

        <Typography align="center" sx={{ mt: 3 }}>
          Back to{" "}
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
    </Box>
  );
};

export default ForgotPassword;
