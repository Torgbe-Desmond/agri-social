import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
  replies: [],
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
    clearReplies: (state, action) => {
      state.replies = [];
    },
    updateCommentList: (state, action) => {
      const { comments } = action.payload;
      state.comments = mergeUnique(state.comments, comments);
    },
    updateReplyList: (state, action) => {
      const { replies, singleReply, parent } = action.payload;
      // console.log(replies, singleReply, parent)
      const foundIndex = state.replies.findIndex((r) => r.parent === parent);

      if (foundIndex === -1) {
        state.replies.push({ replies, singleReply, parent });
      } else {
        state.replies[foundIndex] = { replies, singleReply, parent };
      }
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
  updateReplyList,
} = commentSlice.actions;
export default commentSlice.reducer;
