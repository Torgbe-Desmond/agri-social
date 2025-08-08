import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./AuthSlice";
import postReducer from "./PostSlice";
// import commentReducer from "./CommentSlice";
import predictionReducer from "./PredictionSlice";
import stackReducer from "./StackSlice";
import notifcationReducer from "./notificationSlice";
import searchReducer from "./SearchSlice";
import productReducer from "./ProductSlice";
import messageReducer from "./MessageSlice";

import { notificationApi } from "./notificationApi";
import { postApi } from "./postApi";
import { messageApi } from "./messageApi";
import { predictionApi } from "./predictionApi";
import { productApi } from "./productApi";
import { userApi } from "./userApi";
import { authApi } from "./authApi";
import { commentApi } from "./commentApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    prediction: predictionReducer,
    stack: stackReducer,
    notification: notifcationReducer,
    search: searchReducer,
    product: productReducer,
    message: messageReducer,
    [authApi.reducerPath]: authApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [predictionApi.reducerPath]: predictionApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [userApi.reducerPath]: userApi.reducer, // <-- Fix here, remove extra comma and letter 'a'
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      notificationApi.middleware,
      postApi.middleware,
      commentApi.middleware,
      productApi.middleware,
      predictionApi.middleware,
      messageApi.middleware,
      userApi.middleware // add all middlewares here
    ),
});
