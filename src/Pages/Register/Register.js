import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../Features/authApi"; // <-- import your RTK Query mutation here

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const reference_Id = localStorage.getItem("reference_Id");
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [register, { isLoading, error, data }] = useRegisterMutation();

  useEffect(() => {
    // Navigate when registration succeeds and reference_Id exists
    if (data && reference_Id) {
      navigate(`/${reference_Id}/directories`);
    }
  }, [data, reference_Id, navigate]);

  useEffect(() => {
    // Show error snackbar if RTK Query mutation error occurs
    if (error) {
      // error could be an object or string, adjust as needed
      const errorMsg = error?.data?.message || error?.message || "Registration failed";
      setSnackbarMessage(errorMsg);
      setOpenSnackbar(true);
    }
  }, [error]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleChange = (e) => {
    if (e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value);
    } else {
      setUserInfo({
        ...userInfo,
        [e.target.name]: e.target.value,
      });
    }
    setPasswordError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !userInfo?.username ||
      !userInfo?.email ||
      !userInfo?.password ||
      !confirmPassword
    ) {
      setSnackbarMessage("Please fill in all fields.");
      setOpenSnackbar(true);
      return;
    }

    if (userInfo?.password !== confirmPassword) {
      setPasswordError(true);
      setSnackbarMessage("Passwords don't match.");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append("username", userInfo.username);
    formData.append("email", userInfo.email);
    formData.append("password", userInfo.password);

    register({ formData })
      .unwrap()
      .then(() => {
        navigate(`/`);
        window.location.reload();
      })
      .catch(() => {
        // error is handled by useEffect, no need to do anything here
      });
  };

  const darkMode = {
    color: isDarkMode ? "#FFF" : "",
    "& .MuiInputBase-input": {
      color: isDarkMode ? "#FFF" : "",
      background: isDarkMode ? "#555" : "",
    },
    "& .MuiInputBase-input::placeholder": {
      color: isDarkMode ? "#FFF" : "",
    },
  };

  return (
    <div className="register-container">
      <Container maxWidth="sm">
        <Box mt={2} p={4}>
          <form className="register-form" onSubmit={handleSubmit}>
            <Box>
              <TextField
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid #ccc",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "40px",
                  },
                }}
                placeholder="Username"
                name="username"
                autoComplete="off"
                value={userInfo.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={isLoading}
              />
            </Box>

            <Box>
              <TextField
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid #ccc",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "40px",
                  },
                }}
                placeholder="Email"
                name="email"
                autoComplete="off"
                value={userInfo.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={isLoading}
              />
            </Box>

            <Box>
              <TextField
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid #ccc",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "40px",
                  },
                }}
                placeholder="Password"
                name="password"
                type="password"
                autoComplete="off"
                value={userInfo.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={isLoading}
              />
            </Box>

            <Box>
              <TextField
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid #ccc",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "40px",
                  },
                }}
                placeholder="Confirm Password"
                name="confirmPassword"
                type="password"
                autoComplete="off"
                value={confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={passwordError}
                disabled={isLoading}
                helperText={passwordError ? "Passwords don't match" : ""}
              />
            </Box>

            <Button
              type="submit"
              className="tweetBox__tweetButton "
              variant="outlined"
              color={passwordError ? "error" : "primary"}
              fullWidth
              disabled={isLoading}
              style={{ position: "relative", marginTop: 10, height: "50px" }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Box>
        <Typography align="center">
          Already have an account?{" "}
          <Link
            sx={{ color: "blue", ml: 2 }}
            to="/"
            variant="body2"
            className={`${isDarkMode ? "switch" : ""}`}
          >
            Login here
          </Link>
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

export default Register;
