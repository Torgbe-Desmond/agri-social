import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PostService } from "../Services/PostService";
import { likeService } from "../Services/likeService";
import { CommentService } from "../Services/CommentService";
import { PredictionService } from "../Services/PredictionService";
import { SavedService } from "../Services/savePost";

const initialState = {
  postData: [],
  streamData: [],
  streamStatus: "idle",
  numb_found: null,
  post: null,
  hasMore: true,
  hasMoreStreams: true,
  scrollTo: "",
  postHistory: [],
  userPostHistory: [],
  selectedPostId: "",
  savedHistory: [],
  postCount: 0,
  userPostCount: 0,
  stream_numb_found: 0,
  comments: [],
  userPostHistoryStatus: "idle",
  createPostStatus: "idle",
  commentStatus: "idle",
  postHistoryStatus: "idle",
  singlePostStatus: "idle",
  postStatus: "idle",
  likeStatus: "idle",
  savedStatus: "idle",
  postDeleteStatus: "idle",
  unSavePostStatus: "idle",
};

export const createPost = createAsyncThunk(
  "post/createPost",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await PostService.createPost(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPosts = createAsyncThunk(
  "post/getPosts",
  async ({ user_id, offset, limit }, thunkAPI) => {
    try {
      const response = await PostService.getPosts(user_id, offset, limit);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getStreams = createAsyncThunk(
  "post/getStreams",
  async ({ user_id, offset, limit }, thunkAPI) => {
    try {
      const response = await PostService.getStreams(user_id, offset, limit);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPost = createAsyncThunk(
  "post/getPost",
  async ({ post_id }, thunkAPI) => {
    try {
      const response = await PostService.getPost(post_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPostHistory = createAsyncThunk(
  "post/getPostHistory",
  async ({ user_id }, thunkAPI) => {
    try {
      const response = await PostService.getPostHistory(user_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserPostHistory = createAsyncThunk(
  "post/getUserPostHistory",
  async ({ user_id }, thunkAPI) => {
    try {
      const response = await PostService.getPostHistory(user_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletPost",
  async ({ post_id }, thunkAPI) => {
    try {
      const response = await PostService.deletePost(post_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const likePost = createAsyncThunk(
  "like/likePost",
  async ({ post_id, formData }, thunkAPI) => {
    try {
      const response = await likeService.addLike(post_id, formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getComments = createAsyncThunk(
  "comment/getComments",
  async ({ post_id }, thunkAPI) => {
    try {
      const response = await CommentService.geComments(post_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ post_id, formData }, thunkAPI) => {
    try {
      const response = await CommentService.addComment(formData, post_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const savePost = createAsyncThunk(
  "post/savePost",
  async ({ post_id, formData }, thunkAPI) => {
    try {
      const response = await SavedService.savePost(post_id, formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const unSavePost = createAsyncThunk(
  "post/unSavePost",
  async ({ post_id, user_id }, thunkAPI) => {
    try {
      const response = await SavedService.unSavePostHistory(post_id, user_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSavedHistory = createAsyncThunk(
  "post/getSavedHistory",
  async ({ user_id }, thunkAPI) => {
    try {
      const response = await SavedService.savedPostHistory(user_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostId: (state, action) => {
      state.selectedPostId = action.payload;
    },
    clearPostData: (state) => {
      state.postData = [];
    },
    clearPost: (state) => {
      state.post = null;
    },
    setPostScrollTo: (state, action) => {
      state.scrollTo = action.payload;
    },
    clearStreams: (state) => {
      state.setPostId = [];
    },
    clearPostScrollToId: (state, action) => {},
    clearStatus: (state) => {
      state.commentStatus = "idle";
      state.postHistoryStatus = "idle";
      state.postStatus = "idle";
      state.likeStatus = "idle";
      state.savedStatus = "idle";
      state.postDeleteStatus = "idle";
      state.unSavePostStatus = "idle";
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
    updateStreamSaved: (state, action) => {
      const { post_id, saved } = action.payload;
      state.streamData = state.streamData?.map((p) => {
        if (p.post_id === post_id) {
          return {
            ...p,
            saved: saved ? (p.saved || 0) + 1 : p.saved - 1,
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.createPostStatus = "loading";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.postData.unshift(action.payload);
        state.postData = [...state.postData];
        state.createPostStatus = "succeeded";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createPostStatus = "failed";
      })
      .addCase(getPosts.pending, (state, action) => {
        state.postStatus = "loading";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        console.log(action.payload);
        const { posts, numb_found } = action.payload;
        state.hasMore = posts.length > 0;
        if (state.hasMore) {
          state.postData = [...new Set([...state.postData, ...posts])];
        }
        state.numb_found = numb_found;
        state.postStatus = "succeeded";
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.postStatus = "failed";
      })

      .addCase(getStreams.pending, (state, action) => {
        state.streamStatus = "loading";
      })
      .addCase(getStreams.fulfilled, (state, action) => {
        const { posts, numb_found } = action.payload;
        state.hasMoreStreams = posts.length > 0;

        if (state.hasMoreStreams) {
          const existingIds = new Set(
            state.streamData.map((post) => post.post_id)
          );
          const newPosts = posts.filter(
            (post) => !existingIds.has(post.post_id)
          );
          state.streamData = [...state.streamData, ...newPosts];
        }

        state.stream_numb_found = numb_found;
        state.streamStatus = "succeeded";
      })

      .addCase(getStreams.rejected, (state, action) => {
        state.streamStatus = "failed";
      })

      .addCase(getPost.pending, (state, action) => {
        state.singlePostStatus = "loading";
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.post = action.payload;
        state.singlePostStatus = "succeeded";
      })
      .addCase(getPost.rejected, (state, action) => {
        state.singlePostStatus = "failed";
      })

      .addCase(getPostHistory.pending, (state) => {
        state.postHistoryStatus = "loading";
      })
      .addCase(getPostHistory.fulfilled, (state, action) => {
        state.postHistory = [...action.payload];
        state.postHistoryStatus = "succeeded";
        state.postCount = state.postHistory.length;
      })
      .addCase(getPostHistory.rejected, (state, action) => {
        state.postHistoryStatus = "failed";
      })

      .addCase(getUserPostHistory.pending, (state) => {
        state.userPostHistoryStatus = "loading";
      })
      .addCase(getUserPostHistory.fulfilled, (state, action) => {
        state.userPostHistory = [...action.payload];
        state.userPostCount = state.postCount = state.userPostHistory.length;

        state.userPostHistoryStatus = "succeeded";
      })
      .addCase(getUserPostHistory.rejected, (state, action) => {
        state.userPostHistoryStatus = "failed";
      })

      .addCase(deletePost.pending, (state) => {
        state.postDeleteStatus = "loading";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.postHistory = state.postHistory.filter(
          (p) => p.post_id !== action.payload.post_id
        );
        state.postDeleteStatus = "succeeded";
        state.selectedPostId = "";
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.postDeleteStatus = "failed";
      })

      // comments
      .addCase(getComments.pending, (state) => {
        state.commentStatus = "loading";
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = [...action.payload];
        state.commentStatus = "succeeded";
      })
      .addCase(getComments.rejected, (state, action) => {
        state.commentStatus = "failed";
      })
      .addCase(addComment.pending, (state, action) => {
        state.commentStatus = "loading";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.post = {
          ...state.post,
          comments: (state.post.comment || 0) + 1,
        };
        state.commentStatus = "succeeded";
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commentStatus = "failed";
      })

      // likes
      .addCase(likePost.pending, (state) => {
        state.likeStatus = "loading";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { post_id, liked } = action.payload;
        state.postData = state.postData?.map((p) => {
          if (p.post_id === post_id) {
            return {
              ...p,
              likes: liked ? (p.likes || 0) + 1 : p.likes - 1,
            };
          }
          return p;
        });
        state.likeStatus = "succeeded";
      })
      .addCase(likePost.rejected, (state, action) => {
        state.likeStatus = "failed";
      })

      // saved history
      .addCase(savePost.pending, (state) => {
        state.savedStatus = "loading";
      })
      .addCase(savePost.fulfilled, (state, action) => {
        const { post_id, saved } = action.payload;
        state.postData = state.postData?.map((p) => {
          if (p.post_id === post_id) {
            return {
              ...p,
              saved: saved ? (p.saved || 0) + 1 : p.saved - 1,
            };
          }
          return p;
        });
        state.savedStatus = "succeeded";
      })
      .addCase(savePost.rejected, (state, action) => {
        state.savedStatus = "failed";
      })

      // Get saved history
      .addCase(getSavedHistory.pending, (state) => {
        state.savedStatus = "loading";
      })
      .addCase(getSavedHistory.fulfilled, (state, action) => {
        state.savedHistory = [...action.payload];
        state.savedStatus = "succeeded";
      })
      .addCase(getSavedHistory.rejected, (state, action) => {
        state.savedStatus = "failed";
      })

      //  unSave history
      .addCase(unSavePost.pending, (state) => {
        state.unSavePostStatus = "loading";
      })
      .addCase(unSavePost.fulfilled, (state, action) => {
        state.unSavePostStatus = "succeeded";
        console.log(action.payload);
        state.savedHistory = state.savedHistory.filter(
          (s) => s.post_id !== action.payload?.post_id
        );
      })
      .addCase(unSavePost.rejected, (state, action) => {
        state.unSavePostStatus = "failed";
      });
  },
});

export const {
  setPostId,
  clearStatus,
  clearPost,
  clearPostData,
  setPostScrollTo,
  clearPostScrollToId,
  updateStreamLike,
  updateStreamSaved,
  updateStreamComment,
  clearStreams,
} = postSlice.actions;
export default postSlice.reducer;
