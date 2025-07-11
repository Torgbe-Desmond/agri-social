import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { clearError, login } from '../../Features/AuthSlice';
import {
  TextField,
  Button,
  Container,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { login } from "../../Features/AuthSlice";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = localStorage.getItem("cc_ft") ? true : false;

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!credentials.email) {
      setSnackbarMessage("Email is required");
      setOpenSnackbar(true);
      return;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      setSnackbarMessage("Please enter a valid email");
      setOpenSnackbar(true);
      return;
    }

    if (!credentials.password) {
      setSnackbarMessage("Password is required");
      setOpenSnackbar(true);
      return;
    } else if (credentials.password.length < 6) {
      setSnackbarMessage("Password must be at least 6 characters");
      setOpenSnackbar(true);
      return;
    }

    console.log(credentials);

    const formData = new FormData();
    formData.append("email", credentials?.email);
    formData.append("password", credentials?.password);

    dispatch(login({ formData }));
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className={`login-container`}>
      <Container
        display="flex"
        flexDirection="column"
        maxWidth="sm"
        align="center"
      >
        {/* <Typography variant="h4" align="center">
          <ShareOutlinedIcon sx={{ fontSize: 50 }} />
          <FileCopyOutlinedIcon sx={{ fontSize: 50 }} />
        </Typography> */}
        <Box mt={4} p={4}>
          <form className="login-form" onSubmit={handleSubmit}>
            <Box
            // sx={{ bgcolor: "background.paper", border: "1px solid #ccc" }}
            // className="login__input"
            >
              <TextField
                placeholder="Email"
                name="email"
                autoComplete="off"
                value={credentials.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  autoComplete: "new-email", // or use a random string like "nope"
                }}
                // sx={{
                //   borderColor: "divider",
                //   borderRadius: "12px",

                //   "& .MuiOutlinedInput-root": {
                //     "& fieldset": {
                //       borderColor: "transparent",
                //     },
                //     "&:hover fieldset": {
                //       borderColor: "transparent",
                //     },
                //     "&.Mui-focused fieldset": {
                //       borderColor: "transparent",
                //     },
                //   },
                // }}
                disabled={status === "loading"}
              />
            </Box>
            <Box
            // sx={{ bgcolor: "background.paper", border: "1px solid #ccc" }}
            // className="login__input"
            >
              <TextField
                // sx={{
                //   borderColor: "divider",
                //   borderRadius: "12px",

                //   "& .MuiOutlinedInput-root": {
                //     "& fieldset": {
                //       borderColor: "transparent",
                //     },
                //     "&:hover fieldset": {
                //       borderColor: "transparent",
                //     },
                //     "&.Mui-focused fieldset": {
                //       borderColor: "transparent",
                //     },
                //   },
                // }}
                InputProps={{
                  autoComplete: "new-password",
                }}
                autoComplete="off"
                placeholder="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={status === "loading"}
              />
            </Box>

            <Typography align="right" sx={{ margin: 2 }}>
              <Link to="/forgot-password">Forgot Password?</Link>
            </Typography>

            <Button
              type="submit"
              className="tweetBox__tweetButton "
              variant="outlined"
              fullWidth
              disabled={status === "loading"}
            >
              {status === "loading" ? (
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
