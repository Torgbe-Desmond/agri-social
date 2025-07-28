import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
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
import CommentReplies from "./components/Comment/CommentReplies";
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
import Posts from "./Pages/Posts/Posts";
import Products from "./Pages/Products/Products";
import { useError } from "./components/Errors/Errors";
import SuccessMessage from "./components/SuccessMessage/SuccessMessage";
import TopHeader from "./components/TopHeader/TopHeader";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  const { message, setMessage } = useError();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, [localStorage.getItem("access_token")]);

  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const isMobile = useMediaQuery("(max-width:640px)");
  const { components, scrolling, onlineStatus } = useSelector(
    (state) => state.stack
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const handleSnackbarClose = () => {
    setMessage(null);
    dispatch(clearOnLineStatus());
    setErrorMessage(null);
  };

  return (
    <div className="app">
      <Router>
        {/* Authenticated layout */}
        {isAuthenticated &&
          (isMobile ? scrolling && <BottomBar /> : <Sidebar />)}
        <Routes>
          {!isAuthenticated && <Route path="/" element={<Login />} />}
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
              <Route path="/:reference_id" element={<Main />} />
              <Route path="/:reference_id/you" element={<Profile />} />
              <Route path="/:reference_id/bookmarks" element={<Bookmarks />} />
              <Route path="/:reference_id/products" element={<Products />} />
              <Route path="/:reference_id/post-history" element={<Posts />} />
              <Route
                path="/:reference_id/predictions"
                element={<Predictions />}
              />
              <Route
                path="/:reference_id/post/:post_id"
                element={<PostComment />}
              />
              <Route
                path="/:reference_id/replies/:comment_id"
                element={<CommentReplies />}
              />
              <Route
                path="/:reference_id/predict-disease"
                element={<PredictDisease />}
              />
              <Route path="/:reference_id/user/:_user_id" element={<User />} />
              <Route
                path="/:reference_id/notifications"
                element={<Notifications />}
              />
              <Route
                path="/:reference_id/messages"
                element={<Conversations />}
              />
              <Route
                path="/:reference_id/market-place"
                element={<MarketPlace />}
              />
              <Route
                path="/:reference_id/product/:product_id"
                element={<ProductDetails />}
              />
              <Route
                path="/:reference_id/create-product"
                element={<CreateProduct />}
              />
              <Route
                path="/:reference_id/chat/:conversation_id/c/:recipient_id"
                element={<Chat />}
              />
              <Route
                path="/:reference_id/group-chat/:conversation_id"
                element={<GroupConversation />}
              />
              <Route path="/:reference_id/streams" element={<Streams />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/" replace />} />
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
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {message}
        </Alert>
      </Snackbar>

      {/* <Snackbar
        open={Boolean(SuccessMessage)}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={onlineStatus === true ? `success` : "error"}
        >
          {SuccessMessage}
        </Alert>
      </Snackbar> */}
    </div>
  );
}

export default App;
