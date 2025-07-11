import { createSlice } from "@reduxjs/toolkit";

const stackSlice = createSlice({
  name: "stack",
  initialState: {
    search: false,
    components: [],
    mainPathIndex: 0,
    stackState: "",
    scrolling: false,
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
    toggleSearch: (state) => {
      state.search = !state.search;
    },
    setMainPathIndex: (state, action) => {
      state.mainPathIndex = action.payload;
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
} = stackSlice.actions;
export default stackSlice.reducer;
