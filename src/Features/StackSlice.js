import { createSlice } from "@reduxjs/toolkit";

const stackSlice = createSlice({
  name: "stack",
  initialState: {
    search: false,
    components: [],
    draggableComponents: [],
    stackState: "",
    scrolling: false,
    index: 0,
    message: "",
    onlineStatus: null,
  },
  reducers: {
    // pushComponent: (state, action) => {
    //   state.components.push(action.payload);
    //   state.stackState = "mounted";

    // },
    pushComponent: (state, action) => {
      state.components.push({
        id: action.payload.id,
        props: action.payload.props || {},
        // position: action.payload.position || { x: 100, y: 400 },
        // size: action.payload.size || { width: 450, height: 300 },
      });
    },
    pushOnToDraggableComponent: (state, action) => {
      state.draggableComponents.push({
        id: action.payload.id,
        props: action.payload.props || {},
        position: action.payload.position || { x: 100, y: 400 },
        size: action.payload.size || { width: 450, height: 300 },
      });
    },
    removeComponentById: (state, action) => {
      state.draggableComponents = state.components.filter(
        (comp) => comp.id !== action.payload
      );
    },
    updateWindowPosition: (state, action) => {
      const { index, x, y } = action.payload;
      state.draggableComponents[index].position = { x, y };
    },
    updateWindowSizeAndPosition: (state, action) => {
      const { index, width, height, x, y } = action.payload;
      state.draggableComponents[index].size = { width, height };
      state.draggableComponents[index].position = { x, y };
    },
    bringToFront: (state, action) => {
      const { index } = action.payload;
      state.draggableComponents[index].zIndex = state.nextZIndex++;
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
  removeComponentById,
  updateWindowPosition,
  updateWindowSizeAndPosition,
  bringToFront,
  pushOnToDraggableComponent,
} = stackSlice.actions;
export default stackSlice.reducer;
