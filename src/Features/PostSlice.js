import { AlignVerticalBottomSharp } from "@mui/icons-material";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  // === Post Data ===
  posts: [],
  postsOffset: 1,

  // === Stream Data ===
  streamData: [],
  streamDataOffset: 1,

  // === Post History ===
  postHistory: [],
  postHistoryOffset: 1,

  // === User Post History ===
  userPostHistory: [],
  userPostHistoryOffset: 1,

  // === Saved Posts ===
  savedHistory: [],
  savedHistoryOffset: 1,

  // === Comments ===
  comments: [],
  commentsOffset: 1,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    updatePostList: (state, action) => {
      const { postData } = action.payload;
      state.posts = [...state.posts, ...postData];
    },
    emptyUserPostHistory: (state) => {
      state.userPostHistory = [];
    },
    addNewPost: (state, action) => {
      const { postData } = action.payload;
      state.posts.unshift(postData);
    },
    updateSavedPostList: (state, action) => {
      const { postData } = action.payload;
      state.savedHistory = [...state.savedHistory, ...postData];
    },
    updateStreamList: (state, action) => {
      const { streamData } = action.payload;
      state.streamData = [...state.streamData, ...streamData];
    },
    updatePostHistoryList: (state, action) => {
      const { postData } = action.payload;
      state.postHistory = [...state.postHistory, ...postData];
    },
    updateUserPostHistoryList: (state, action) => {
      const { userPostHistory } = action.payload;
      state.userPostHistory = [...state.userPostHistory, ...userPostHistory];
    },
    updateStreamLike: (state, action) => {
      const { post_id, liked } = action.payload;
      state.streamData = state.streamData?.map((p) => {
        if (p.post_id === post_id) {
          return {
            ...p,
            likes: liked ? (p.likes || 0) + 1 : p.likes - 1,
          };
        }
        return p;
      });
    },
    updatePostLike: (state, action) => {
      const { post_id, liked } = action.payload;
      state.posts = (state.posts || []).map((p) => {
        if (p.post_id === post_id) {
          const currentLikes = Number(p.likes ?? 0);
          return {
            ...p,
            likes: liked ? currentLikes + 1 : Math.max(currentLikes - 1, 0),
            liked: liked,
          };
        }
        return p;
      });
    },
    updatePostSaved: (state, action) => {
      const { post_id, saved } = action.payload;
      state.posts = (state.posts || []).map((p) => {
        if (p.post_id === post_id) {
          const currentSaves = Number(p.saves ?? 0);
          return {
            ...p,
            saves: saved ? currentSaves + 1 : Math.max(currentSaves - 1, 0),
            saved: saved,
          };
        }
        return p;
      });
    },
    removeDeletedPost: (state, action) => {
      const { post_id } = action.payload;
      state.posts = (state.posts || []).filter((p) => p.post_id !== post_id);
    },
    updateStreamSaved: (state, action) => {
      const { post_id, saved } = action.payload;

      state.streamData = (state.streamData || []).map((p) => {
        if (p.post_id === post_id) {
          const currentSaves = Number(p.saves ?? 0);
          return {
            ...p,
            saves: saved ? currentSaves + 1 : Math.max(currentSaves - 1, 0),
            saved: saved,
          };
        }
        return p;
      });
    },

    updateStreamComment: (state, action) => {
      const { comment_id } = action.payload;
      state.streamData = state.streamData?.map((c) => {
        if (c.id === comment_id) {
          return {
            ...c,
            comment: (c.comment || 0) + 1,
          };
        }
        return c;
      });
    },
    // === Offset Update Reducers ===
    setPostsOffset: (state, action) => {
      state.postsOffset = state.postsOffset + 1;
    },
    setStreamDataOffset: (state, action) => {
      state.streamDataOffset = state.streamDataOffset + 1;
    },
    setPostHistoryOffset: (state, action) => {
      state.postHistoryOffset = state.postHistoryOffset + 1;
    },
    setUserPostHistoryOffset: (state, action) => {
      state.userPostHistoryOffset = state.userPostHistoryOffset + 1;
    },
    setSavedHistoryOffset: (state, action) => {
      state.savedHistoryOffset = state.savedHistoryOffset + 1;
    },
    setCommentsOffset: (state, action) => {
      state.commentsOffset = state.commentsOffset + 1;
    },
  },

  extraReducers: (builder) => {},
});

export const {
  updateStreamLike,
  updatePostLike,
  updateStreamSaved,
  updateStreamComment,
  updatePostList,
  updatePostHistoryList,
  updateStreamList,
  updatePostSaved,
  updateSavedPostList,
  addNewPost,
  removeDeletedPost,
  updateUserPostHistoryList,
  emptyUserPostHistory,

  setPostsOffset,
  setStreamDataOffset,
  setPostHistoryOffset,
  setUserPostHistoryOffset,
  setSavedHistoryOffset,
  setCommentsOffset,
} = postSlice.actions;
export default postSlice.reducer;
