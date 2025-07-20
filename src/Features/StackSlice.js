import { createSlice } from "@reduxjs/toolkit";

const stackSlice = createSlice({
  name: "stack",
  initialState: {
    search: false,
    components: [],
    stackState: "",
    scrolling: false,
    index: 0,
    message: "",
    onlineStatus: null,
  },
  reducers: {
    pushComponent: (state, action) => {
      // state.components.shift();
      state.components.push(action.payload);
      state.stackState = "mounted";
    },
    setScrolling: (state, action) => {
      state.scrolling = action.payload;
    },
    popComponent: (state) => {
      state.components.pop();
    },
    clearStack: (state) => {
      state.components = [];
      state.stackState = "dropped";
    },
    clearOnLineStatus: (state) => {
      state.message = "";
      state.onlineStatus = null;
    },
    onlineStatus: (state, action) => {
      const { status, message } = action.payload;
      state.message = message;
      state.onlineStatus = status;
    },
    toggleSearch: (state) => {
      state.search = !state.search;
    },
    setMainPathIndex: (state, action) => {
      state.index = action.payload;
    },
  },
});

export const {
  pushComponent,
  popComponent,
  clearStack,
  toggleSearch,
  setMainPathIndex,
  setScrolling,
  onlineStatus,
  clearOnLineStatus,
} = stackSlice.actions;
export default stackSlice.reducer;
