import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CommentService } from "../Services/CommentService";

const initialState = {
  comments: [],
  singleComment: null,
  singleCommentStatus: "idle",
  likeCommentStatus: "idle",
  scrollTo: "",
  commentStatus: "idle",
  addCommentStatus: "idle",
  commentParentStatus: "idle",
};

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

export const getReplies = createAsyncThunk(
  "comment/getReplies",
  async ({ comment_id }, thunkAPI) => {
    try {
      const response = await CommentService.getReplies(comment_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getComment = createAsyncThunk(
  "comment/getComment",
  async ({ comment_id }, thunkAPI) => {
    try {
      const response = await CommentService.geComment(comment_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCommentParent = createAsyncThunk(
  "comment/getCommentParent",
  async ({ parent_id }, thunkAPI) => {
    try {
      const response = await CommentService.getCommentParent(parent_id);
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

export const likeComment = createAsyncThunk(
  "like/likeComment",
  async ({ comment_id, formData }, thunkAPI) => {
    try {
      const response = await CommentService.addCommentLike(
        comment_id,
        formData
      );
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addReplyComment = createAsyncThunk(
  "comment/addReplyComment",
  async ({ comment_id, formData }, thunkAPI) => {
    try {
      const response = await CommentService.addReplyComment(
        formData,
        comment_id
      );
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state, action) => {
      state.comments = [];
    },
    setCommentScrollTo: (state, action) => {
      state.scrollTo = action.payload;
    },
    clearCommentScrollTo: (state) => {
      state.scrollTo = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.commentStatus = "loading";
      })
      .addCase(getComments.fulfilled, (state, action) => {
        const { comments, numb_found } = action.payload;
        state.comments = [...comments];
        state.commentStatus = "succeeded";
      })
      .addCase(getComments.rejected, (state, action) => {
        state.commentStatus = "failed";
      })
      .addCase(getComment.pending, (state) => {
        state.singleCommentStatus = "loading";
      })
      .addCase(getComment.fulfilled, (state, action) => {
        state.singleComment = action.payload;
        state.singleCommentStatus = "succeeded";
      })
      .addCase(getComment.rejected, (state, action) => {
        state.singleCommentStatus = "failed";
      })
      .addCase(getCommentParent.rejected, (state, action) => {
        state.commentStatus = "failed";
      })
      .addCase(getCommentParent.pending, (state) => {
        state.commentStatus = "loading";
      })
      .addCase(getCommentParent.fulfilled, (state, action) => {
        state.comments = [...action.payload];
        state.commentStatus = "succeeded";
      })

      .addCase(getReplies.pending, (state) => {
        state.commentStatus = "loading";
      })
      .addCase(getReplies.fulfilled, (state, action) => {
        const { comments, numb_found } = action.payload;
        state.comments = [...state.comments, ...comments];
        state.commentStatus = "succeeded";
      })
      .addCase(getReplies.rejected, (state, action) => {
        state.commentStatus = "failed";
      })

      .addCase(addReplyComment.pending, (state, action) => {
        state.commentStatus = "loading";
      })

      .addCase(addReplyComment.fulfilled, (state, action) => {
        state.singleComment = {
          ...state.singleComment,
          replies: (state.singleComment.replies || 0) + 1,
        };
        state.commentStatus = "succeeded";
      })
      .addCase(addReplyComment.rejected, (state, action) => {
        state.commentStatus = "failed";
      })

      .addCase(addComment.pending, (state, action) => {
        state.addCommentStatus = "loading";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.addCommentStatus = "succeeded";
      })
      .addCase(addComment.rejected, (state, action) => {
        state.addCommentStatus = "failed";
      })
      .addCase(likeComment.pending, (state) => {
        state.likeCommentStatus = "loading";
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const { comment_id, liked } = action.payload;
        state.comments = state.comments?.map((c) => {
          if (c.id === comment_id) {
            const currentLikes = Number(c.likes) || 0;
            return {
              ...c,
              likes: liked ? currentLikes + 1 : Math.max(currentLikes - 1, 0),
              liked: liked,
            };
          }
          return c;
        });

        if (state.singleComment) {
          state.singleComment = {
            ...state.singleComment,
            likes: liked
              ? (Number(state.singleComment.likes) || 0) + 1
              : Math.max((Number(state.singleComment.likes) || 0) - 1, 0),
            liked: liked,
          };
        }
        state.likeCommentStatus = "succeeded";
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.likeCommentStatus = "failed";
      });
  },
});

export const { clearComments, setCommentScrollTo, clearCommentScrollTo } =
  commentSlice.actions;
export default commentSlice.reducer;
