import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../Services/AuthService";

const initialState = {
  userDetails: null,
  _userDetails: null,
  users: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.userDetails = action.payload;
    },
    updateUserList: (state, action) => {
      const { users } = action.payload;
      const existingIds = new Set(state.users.map((u) => u.id));
      const newUsers = users.filter((u) => !existingIds.has(u.id));
      state.users = [...state.users, ...newUsers];
    },
    removeNewlyFollowed: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
  },
  extraReducers: (builder) => {},
});

export const { updateUserList, removeNewlyFollowed, addUser } =
  authSlice.actions;
export default authSlice.reducer;
