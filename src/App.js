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
import Streams from "./components/Streams/Streams";
import Conversations from "./components/Conversations/Conversations";
import GroupConversation from "./components/GroupConversation/GroupConversation";
import { clearOnLineStatus } from "./Features/StackSlice";
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
  const { components, scrolling, onlineStatus, message } = useSelector(
    (state) => state.stack
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const handleSnackbarClose = () => {
    dispatch(clearOnLineStatus())
    setErrorMessage(null);
  };

  return (
    <div className="app">
      <Router>
        {/* Authenticated layout */}
        {isAuthenticated &&
          (isMobile ? scrolling && <BottomBar /> : <Sidebar />)}

        <Routes>
          {!isAuthenticated && <Route path="/login" element={<Login />} />}
          {!isAuthenticated && (
            <Route path="/register" element={<Register />} />
          )}

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
              <Route path="/messages" element={<Conversations />} />
              <Route path="/market-place" element={<MarketPlace />} />
              <Route path="/product/:product_id" element={<ProductDetails />} />
              <Route path="/create-product" element={<CreateProduct />} />
              <Route path="/chat/:recipient_id" element={<Chat />} />
              <Route
                path="/group-chat/:conversation_id"
                element={<GroupConversation />}
              />
              <Route path="/streams" element={<Streams />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>

        {isAuthenticated && <Widgets />}
        <div className="component">
          {components.map((item) => (
            <div key={item.id}>{item?.component}</div>
          ))}
        </div>
      </Router>

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={onlineStatus === true ? `success` : "error"}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
