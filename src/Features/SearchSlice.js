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
  mentionedUSers: [],
  mentionedGroups: [],
  searchMentionedUsersStatus: "idle",
  searchMentionedUGroupStatus: "idle",
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
export const searchMentionedUsers = createAsyncThunk(
  "search/mentioned",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await SearchService.searchMentionedUsers(formData);
      return response;
    } catch (error) {
      console.log("error", error);
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const searchMentionedGroups = createAsyncThunk(
  "search/group",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await SearchService.searchMentionedUGroups(formData);
      return response;
    } catch (error) {
      console.log("error", error);
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
      })
      .addCase(searchMentionedGroups.pending, (state) => {
        state.searchMentionedUGroupStatus = "loading";
      })
      .addCase(searchMentionedGroups.fulfilled, (state, action) => {
        state.searchMentionedUGroupStatus = "succeeded";
        state.mentionedGroups = mergeUnique(
          state.mentionedGroups,
          action.payload.results,
          "group_id"
        );
      })
      .addCase(searchMentionedGroups.rejected, (state) => {
        state.searchMentionedUGroupStatus = "failed";
      })
      .addCase(searchMentionedUsers.pending, (state) => {
        state.searchMentionedUsersStatus = "loading";
      })
      .addCase(searchMentionedUsers.fulfilled, (state, action) => {
        state.searchMentionedUsersStatus = "succeeded";
        state.mentionedUSers = mergeUnique(
          state.mentionedUSers,
          action.payload.results,
          "user_id"
        );
      })
      .addCase(searchMentionedUsers.rejected, (state) => {
        state.searchMentionedUsersStatus = "failed";
      });
  },
});

export const { clearSearch, selectedItem, clearSelectedId, clearSelectedItem } =
  searchSlice.actions;

export default searchSlice.reducer;
