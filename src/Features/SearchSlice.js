import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SearchService } from "../Services/SearchService";

const initialState = {
  searchedUserDetails: [],
  selectedSearchId: "",
  searchedUserStatus: "idle",
};

export const searchUser = createAsyncThunk(
  "search/searchUser",
  async ({ username }, thunkAPI) => {
    try {
      const response = await SearchService.searchUser(username);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchedUserDetails = [];
    },
    clearSelectedId: (state) => {
      state.selectedSearchId = "";
    },
    selectedItem: (state, action) => {
      state.selectedSearchId = action.payload;
    },
    clearSelectedItem: (state, action) => {
      state.selectedSearchId = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(searchUser.pending, (state) => {
        state.searchedUserStatus = "loading";
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.searchedUserStatus = "succeeded";
        state.searchedUserDetails = [
          ...state.searchedUserDetails,
          ...action.payload,
        ];
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.searchedUserStatus = "failed";
      });
  },
});

export const { clearSearch, selectedItem, clearSelectedId, clearSelectedItem } =
  authSlice.actions;

export default authSlice.reducer;
