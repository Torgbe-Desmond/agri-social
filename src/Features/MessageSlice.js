import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ConversationService } from "../Services/ConversationService";

const initialState = {
  messages: [],
  users: [],
  groups: [],
  createGroupStatus: "idle",
  getMessagedUsersStatus: "idle",
  getConversationStatus: "idle",
  getdMessagesStatus: "idle",
  getGroupConversationStatus: "idle",
  createConversationStatus: "",
  conversingStatus: "idle",
  error: "",
  conversation_id: "",
  message: "",
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

export const getGroupConversation = createAsyncThunk(
  "conversation/getGroupConversation",
  async (_, thunkAPI) => {
    try {
      const response = await ConversationService.getGroupConversation();
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createConversation = createAsyncThunk(
  "conversation/createConversation",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await ConversationService.createConversation(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const conversing = createAsyncThunk(
  "conversation/conversing",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await ConversationService.conversing(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createGroup = createAsyncThunk(
  "conversation/createGroup",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await ConversationService.createGroup(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMessagedUsers = createAsyncThunk(
  "conversation/getMessagedUsers",
  async (_, thunkAPI) => {
    try {
      const response = await ConversationService.getMessagedUsers();
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
    // setConversaionId: (state, action) => {
    //   state.conversation_id = action.payload;
    // },
    clearConversationId: (state, action) => {
      state.conversation_id = "";
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearGroups: (state) => {
      state.groups = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConversation.pending, (state) => {
        state.createConversationStatus = "loading";
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.message = action.payload;
        state.createConversationStatus = "succeeded";
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.error = action.error.message;
        state.createConversationStatus = "failed";
      })

      .addCase(createGroup.pending, (state) => {
        state.createGroupStatus = "loading";
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups = [...new Set([...state.groups, action.payload])];
        state.createGroupStatus = "succeeded";
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.error = action.error.message;
        state.createGroupStatus = "failed";
      })

      .addCase(conversing.pending, (state) => {
        state.conversingStatus = "loading";
      })
      .addCase(conversing.fulfilled, (state, action) => {
        state.conversation_id = action.payload.conversation_id;
        state.conversingStatus = "succeeded";
      })
      .addCase(conversing.rejected, (state, action) => {
        state.error = action.error.message;
        state.conversingStatus = "failed";
      })

      .addCase(getGroupConversation.pending, (state) => {
        state.getGroupConversationStatus = "loading";
      })
      .addCase(getGroupConversation.fulfilled, (state, action) => {
        state.groups = [...new Set([...state.groups, ...action.payload])];
        state.getGroupConversationStatus = "succeeded";
      })
      .addCase(getGroupConversation.rejected, (state, action) => {
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
        state.getMessagedUsersStatus = "failed";
      });
  },
});

export const {
  addUserMessage,
  addBotMessage,
  clearMessages,
  clearGroups,
  setConversaionId,
  clearConversationId,
} = messageSlice.actions;
export default messageSlice.reducer;
