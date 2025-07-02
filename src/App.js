import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useMediaQuery,
  CircularProgress,
  duration,
  Snackbar,
  Alert,
} from "@mui/material";

import PrivateRoute from "./Layout/PrivateRoute";
import Sidebar from "./components/Sidebar/Sidebar";
import BottomBar from "./components/BottomBar/BottomBar";
import Widgets from "./components/Widgets/Widgets";

import Main from "./Pages/Main/Main";
import Profile from "./Pages/Profile/Profile";
import Bookmarks from "./Pages/Bookmarks/Bookmarks";
import Predictions from "./Pages/Predictions/Predictions";
import PostComment from "./components/PostComment/PostComment";
import CommentReplies from "./components/CommentReplies/CommentReplies";
import PredictDisease from "./Pages/PredictDisease/PredictDisease";
import User from "./Pages/User/User";
import Notifications from "./Pages/Notifications/Notifications";
import Messages from "./components/Messages/Messages";
import MarketPlace from "./components/MarketPlace/MarketPlace";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import CreateProduct from "./components/CreateProduct/CreateProduct";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ComponentStack, {
  componentMap,
} from "./components/HandleStack/HandleStack";

import "./App.css";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import { errorMap } from "./components/Errors/ErrorStatus";
import axiosInstance from "./Services/AxiosInstance";
import Chat from "./components/Chat/Chat";
// green
// background: {
//     default: "rgb(2, 29, 0)",
//     paper: "rgb(1, 46, 34)",
//   },

// dark
//   background: {
//   default: "rgb(4, 4, 4)",
//   paper: "rgb(23, 24, 24)",
// },

function App() {
  const isAuthenticated = localStorage.getItem("cc_ft") ? true : false;
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const isMobile = useMediaQuery("(max-width:640px)");
  const { components } = useSelector((state) => state.stack);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const handleSnackbarClose = () => {
    setErrorMessage(null);
  };

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error) {
        if (error.code === "ERR_BAD_RESPONSE" || error.code === "ERR_NETWORK") {
          setErrorMessage(
            "You are currently offline. Please try connection to the internet"
          );
        }
      }
    }
  );

  // useEffect(()=>{

  // },[])

  useEffect(() => {
    if (systemPrefersDark) {
      // Example: document.body.classList.add("__darkmode");
    }

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [systemPrefersDark]);

  return (
    <div className="app">
      <Router>
        {/* Authenticated layout */}
        {isAuthenticated && (isMobile ? <BottomBar /> : <Sidebar />)}

        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <Route
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  darkMode={{}}
                  systemPrefersDark={systemPrefersDark}
                  isMobile={isMobile}
                />
              }
            >
              <Route path="/" element={<Main />} />
              <Route path="/you" element={<Profile />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/post/:post_id" element={<PostComment />} />
              <Route path="/replies/:comment_id" element={<CommentReplies />} />
              <Route path="/predict-disease" element={<PredictDisease />} />
              <Route path="/user/:_user_id" element={<User />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/market-place" element={<MarketPlace />} />
              <Route path="/product/:product_id" element={<ProductDetails />} />
              <Route path="/create-product" element={<CreateProduct />} />
              <Route path="/chat/:recipient_id" element={<Chat />} />
            </Route>
          ) : (
            // Redirect all unmatched routes to /login
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>

        {/* Global Widget */}
        {isAuthenticated && <Widgets />}
      </Router>

      {/* Floating Overlay Components */}
      <div className="component">
        {components.map((item) => (
          <div key={item.id}>{item?.component}</div>
        ))}
      </div>
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
