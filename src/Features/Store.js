import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import postReducer from "./PostSlice";
import commentReducer from "./CommentSlice";
import predictionReducer from "./PredictionSlice";
import stackReducer from "./StackSlice";
import notifcationReducer from "./notificationSlice";
import searchReducer from "./SearchSlice";
import productReducer from "./ProductSlice";
import messageReducer from './MessageSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    comment: commentReducer,
    prediction: predictionReducer,
    stack: stackReducer,
    notification: notifcationReducer,
    search: searchReducer,
    product: productReducer,
    message:messageReducer,
  },
});
