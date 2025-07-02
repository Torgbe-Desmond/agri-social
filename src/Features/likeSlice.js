import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { likeService } from "../Services/likeService";

const initialState = {
    comments:[],
    commentStatus:"idle"
};

export const likePost = createAsyncThunk(
  "like/likePost",
  async ({ post_id ,formData }, thunkAPI) => {
    try {
      const response = await likeService.addLike(post_id,formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.token = action.payload.token;
      state.reference_Id = action.payload.reference_Id;
      state.message = action.payload.message;
    },
    
  },

  extraReducers: (builder) => {
    builder
      .addCase(likePost.pending, (state) => {
        state.commentStatus = "loading";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { post_id, liked_comment } = action.payload
        state.comments = [...action.payload];
        state.commentStatus = "succeeded";
      })
      .addCase(likePost.rejected, (state,action)=>{
        state.commentStatus = "failed"
      })
  },
});

export const {
  setAuthData,
  clearAuthData,
  clearError,
  clearAuthMessage,
  clearAuthErrorMessage,
} = likeSlice.actions;
export default likeSlice.reducer;
