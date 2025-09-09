import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery, Snackbar, Alert } from "@mui/material";
import { useError } from "../Errors/Errors";
import { useAuthenticatedQuery } from "../../Features/userApi";
import { clearOnLineStatus } from "../../Features/StackSlice";
import PrivateRoute from "../../Layout/PrivateRoute";
import PasswordUpdate from "../../Pages/PasswordUpdate/PasswordUpdate";
import ForgotPassword from "../../Pages/ForgotPassword/ForgotPassword";
import Register from "../../Pages/Register/Register";
import Main from "../../Pages/Main/Main";
import PostHistory from "../PostHistory/PostHistory";
import Products from "../../Pages/Products/Products";
import Posts from "../../Pages/Posts/Posts";
import Predictions from "../../Pages/Predictions/Predictions";
import PostComment from "../PostComment/PostComment";
import CommentReplies from "../Comment/CommentReplies";
import PredictDisease from "../../Pages/PredictDisease/PredictDisease";
import User from "../../Pages/User/User";
import Conversations from "../Chat/Conversations";
import MarketPlace from "../MarketPlace/MarketPlace";
import ProductDetails from "../ProductDetails/ProductDetails";
import CreateProduct from "../CreateProduct/CreateProduct";
import Bookmarks from "../../Pages/Bookmarks/Bookmarks";
import Notifications from "../../Pages/Notifications/Notifications";
import Chat from "../Chat/Chat";
import Streams from "../Streams/Streams";
import Authenticated from "../../Pages/Authenticated/Authenticated";
import Login from "../../Pages/Login/Login";
import GroupConversation from "../GroupConversation/GroupConversation";
import ConversationGroup from "../ConversationGroup/ConversationGroup";
import ComponentStack from "../HandleStack/HandleStack";

function Validated() {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const navigate = useNavigate();
  const { message, setMessage } = useError();
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const isMobile = useMediaQuery("(max-width:640px)");
  const { scrolling } = useSelector((state) => state.stack);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const { data, error } = useAuthenticatedQuery(undefined, {});

  const handleSessionExpired = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("SessionExpired", {});
  };

  useEffect(() => {
    if (error?.status === 401) {
      setIsAuthenticated(false);
      // handleSessionExpired();
    } else if (data?.status) {
      const reference_id = localStorage.getItem("reference_id");
      setIsAuthenticated(data?.status);
    }
  }, [error, data, localStorage.getItem("access_token")]);

  return (
    <div>
      <Routes>
        {!isAuthenticated && <Route path="/" element={<Login />} />}
        {!isAuthenticated && <Route path="/register" element={<Register />} />}
        {!isAuthenticated && (
          <Route path="/verify-email" element={<ForgotPassword />} />
        )}
        {!isAuthenticated && (
          <Route
            path="/:verification_string/update-password"
            element={<PasswordUpdate />}
          />
        )}

        {isAuthenticated && (
          <Route
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                scrolling={scrolling}
                systemPrefersDark={systemPrefersDark}
                isMobile={isMobile}
              />
            }
          >
            <Route path="/:reference_id" element={<Main />} />
            <Route path="/:reference_id/you" element={<PostHistory />} />
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
            <Route path="/:reference_id/messages" element={<Conversations />} />
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
              path="/:reference_id/group-chat/"
              element={<ConversationGroup />}
            />
            <Route
              path="/:reference_id/group-chat/:conversation_id"
              element={<GroupConversation />}
            />
            <Route path="/:reference_id/streams" element={<Streams />} />
          </Route>
        )}
      </Routes>
    </div>
  );
}

export default Validated;
