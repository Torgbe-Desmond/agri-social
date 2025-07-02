import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ConversationService } from "../Services/ConversationService";

const initialState = {
  messages: [],
  users: [],
  getMessagedUsersStatus: "idle",
  getConversationStatus: "idle",
  getdMessagesStatus: "idle",
  error: "",
  conversation_id: "",
};

export const getConversation = createAsyncThunk(
  "conversation/getConversation",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await ConversationService.getConversation(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMessagedUsers = createAsyncThunk(
  "conversation/getMessagedUsers",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await ConversationService.getMessagedUsers(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getdMessages = createAsyncThunk(
  "conversation/getdMessages",
  async ({ conversation_id }, thunkAPI) => {
    try {
      const response = await ConversationService.getMessages(conversation_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "conversation/sendMessage",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await ConversationService.sendMessage(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        sender: "user",
        text: action.payload.text,
        image: action.payload.image || [],
        profilePicture: action.payload.profilePicture || "/user-avatar.png",
      });
    },
    addBotMessage: (state, action) => {
      state.messages.push({
        sender: "bot",
        text: action.payload.text,
        image: null,
        // profilePicture: require("../../assets/icons8-farmer-64.png"),
      });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // get conversation
      .addCase(getConversation.pending, (state) => {
        state.getConversationStatus = "loading";
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.conversation_id = action.payload;
        state.getConversationStatus = "succeeded";
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.error = action.error.message;
        state.getConversationStatus = "failed";
      })

      .addCase(getdMessages.pending, (state) => {
        state.getdMessagesStatus = "loading";
      })
      .addCase(getdMessages.fulfilled, (state, action) => {
        state.messages = [...action.payload];
        state.getdMessagesStatus = "succeeded";
      })
      .addCase(getdMessages.rejected, (state, action) => {
        state.error = action.error.message;
        state.getdMessagesStatus = "failed";
      })
      .addCase(getMessagedUsers.pending, (state) => {
        state.getMessagedUsersStatus = "loading";
      })
      .addCase(getMessagedUsers.fulfilled, (state, action) => {
        state.users = [...action.payload];
        state.getMessagedUsersStatus = "succeeded";
      })
      .addCase(getMessagedUsers.rejected, (state, action) => {
        state.error = action.error.message;
        state.getdMessagesStatus = "failed";
      });
  },
});

export const { addUserMessage, addBotMessage, clearMessages } =
  messageSlice.actions;
export default messageSlice.reducer;
