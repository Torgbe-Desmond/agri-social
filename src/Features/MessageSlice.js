import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  currentlyConversingUser: null,
  users: [],
  groups: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    updateUsersList: (state, action) => {
      const { users } = action.payload;
      state.users = [...state.users, ...users];
    },
    setCurrentlyConversingUserInformation: (state, action) => {
      state.currentlyConversingUser = action.payload;
    },
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
  extraReducers: (builder) => {},
});

export const {
  addUserMessage,
  addBotMessage,
  clearMessages,
  clearGroups,
  setConversaionId,
  clearConversationId,
  updateUsersList,
  setCurrentlyConversingUserInformation,
} = messageSlice.actions;
export default messageSlice.reducer;
