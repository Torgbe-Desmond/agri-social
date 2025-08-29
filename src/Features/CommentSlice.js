import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
  singleComment: null,
};

const mergeUnique = (existing, incoming, key = "id") => {
  const map = new Map();
  [...existing, ...incoming].forEach((item) => {
    map.set(item[key], item);
  });
  return Array.from(map.values());
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state, action) => {
      state.comments = [];
    },
    updateCommentList: (state, action) => {
      const { comments } = action.payload;
      state.comments = mergeUnique(state.comments, comments);
    },
    setCommentScrollTo: (state, action) => {
      state.scrollTo = action.payload;
    },
    clearCommentScrollTo: (state) => {
      state.scrollTo = "";
    },
  },

  extraReducers: (builder) => {},
});

export const {
  clearComments,
  setCommentScrollTo,
  clearCommentScrollTo,
  updateCommentList,
} = commentSlice.actions;
export default commentSlice.reducer;
