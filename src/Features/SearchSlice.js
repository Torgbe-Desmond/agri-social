import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SearchService } from "../Services/SearchService";

const mergeUnique = (existing, incoming, key = "user_id") => {
  const map = new Map();
  [...existing, ...incoming].forEach((item) => {
    map.set(item[key], item);
  });
  return Array.from(map.values());
};

const initialState = {
  searchedUserDetails: [],
  selectedSearchId: "",
  searchedUserStatus: "idle",
};

export const searchUser = createAsyncThunk(
  "search/searchUser",
  async ({ username, offset, limit }, thunkAPI) => {
    try {
      const response = await SearchService.searchUser(username, offset, limit);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const searchSlice = createSlice({
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
    clearSelectedItem: (state) => {
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
        state.searchedUserDetails = mergeUnique(
          state.searchedUserDetails,
          action.payload,
          "user_id"
        );
      })
      .addCase(searchUser.rejected, (state) => {
        state.searchedUserStatus = "failed";
      });
  },
});

export const {
  clearSearch,
  selectedItem,
  clearSelectedId,
  clearSelectedItem,
} = searchSlice.actions;

export default searchSlice.reducer;
