import { createSlice } from "@reduxjs/toolkit";

const stackSlice = createSlice({
  name: "stack",
  initialState: {
    search: false,
    components: [],
    mainPathIndex: 0,
    stackState: "",
  },
  reducers: {
    pushComponent: (state, action) => {
      // state.components.shift();
      state.components.push(action.payload);
      state.stackState = "mounted";
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
} = stackSlice.actions;
export default stackSlice.reducer;
