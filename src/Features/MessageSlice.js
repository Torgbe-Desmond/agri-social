import { createSlice } from "@reduxjs/toolkit";

const mergeUnique = (existing, incoming, key = "id") => {
  const map = new Map();
  [...existing, ...incoming].forEach((item) => {
    map.set(item[key], item);
  });
  return Array.from(map.values());
};

const initialState = {
  messages: [],
  currentlyConversingUser: null,
  users: [],
  groups: [],

  _messages: [],
  _currentlyConversingUser: null,
  _users: [],
  _groups: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    updateUsersList: (state, action) => {
      const { users } = action.payload;
      state.users = mergeUnique(state.users, users, "id");
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
      });
    },
    clearConversationId: (state) => {
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
  clearConversationId,
  updateUsersList,
  setCurrentlyConversingUserInformation,
} = messageSlice.actions;

export default messageSlice.reducer;
