import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../Services/AuthService";

const initialState = {
  userDetails: null,
  userDetailsStatus: "idle",
  _userDetails: null,
  _userDetailsStatus: "idle",
  reference_Id: null,
  isFollowing: null,
  follow: null,
  status: "idle",
  logoutStatus: "idle",
  registerStatus: "idle",
  verifyEmailStatus: "idle",
  updatePasswordStatus: "idle",
  userImageStatus: "idle",
  isFollowingStatus: "idle",
  followStatus: "idle",
  peopleToFollowStatus: "idle",
  role: "",
  errorMessage: null,
  message: "",
  code: null,
  data: [],
  followQ: [],
  hasMoreFollows: 0,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await AuthService.login(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await AuthService.register(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async ({ token, userId }, thunkAPI) => {
    try {
      const response = await AuthService.deleteUser(token, userId);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await AuthService.logout();
    return response;
  } catch (error) {
    const message = error?.response?.data;
    return thunkAPI.rejectWithValue(message);
  }
});

export const sendRecoveryLink = createAsyncThunk(
  "auth/sendRecoveryLink",
  async (email, thunkAPI) => {
    try {
      const response = await AuthService.sendRecoveryLink(email);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ newPassword }, thunkAPI) => {
    try {
      const response = await AuthService.updatePassword(newPassword);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ email }, thunkAPI) => {
    try {
      const response = await AuthService.verifyEmail(email);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getVerificationToken = createAsyncThunk(
  "auth/getVerificationToken",
  async ({ reference_Id }, thunkAPI) => {
    try {
      const response = await AuthService.getVerificationToken(reference_Id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async ({ user_id }, thunkAPI) => {
    try {
      const response = await AuthService.getUser(user_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const _getUser = createAsyncThunk(
  "auth/_getUser",
  async ({ user_id }, thunkAPI) => {
    try {
      const response = await AuthService.getUser(user_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserImage = createAsyncThunk(
  "auth/updateUserImage",
  async ({ user_id, formData }, thunkAPI) => {
    try {
      const response = await AuthService.updateUserImage(user_id, formData);
      return response;
    } catch (error) {
      console.log(error);
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserInformation = createAsyncThunk(
  "auth/updateUserInformation",
  async ({ user_id, formData }, thunkAPI) => {
    try {
      const response = await AuthService.updateUserInformation(
        user_id,
        formData
      );
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const peopleToFollow = createAsyncThunk(
  "auth/peopleToFollow",
  async ({ user_id, offset, limit }, thunkAPI) => {
    try {
      const response = await AuthService.peopleToFollow(user_id, offset, limit);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const isFollowing = createAsyncThunk(
  "auth/isFollowing",
  async ({ user_id, localUser }, thunkAPI) => {
    try {
      const response = await AuthService.isFollowing(user_id, localUser);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const follow = createAsyncThunk(
  "auth/follow",
  async ({ user_id, localUser }, thunkAPI) => {
    try {
      const response = await AuthService.follow(user_id, localUser);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.token = action.payload.token;
      state.reference_Id = action.payload.reference_Id;
      state.message = action.payload.message;
    },
    clearAuthData: (state) => {
      state.token = null;
      state.reference_Id = null;
      state.message = null;
      state.status = "idle";
      state.logoutStatus = "idle";
      state.registerStatus = "idle";
      localStorage.removeItem("token");
      localStorage.removeItem("reference_Id");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAuthMessage: (state) => {
      state.message = "";
    },
    clearAuthErrorMessage: (state) => {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        localStorage.setItem("cc_ft", action.payload?.id);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.payload;
      })

      .addCase(register.pending, (state) => {
        state.registerStatus = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        const {
          data: { reference_Id, token },
          message,
        } = action.payload;
        state.registerStatus = "succeeded";
        state.reference_Id = reference_Id;
        state.message = message;
        localStorage.setItem("token", token);
        localStorage.setItem("reference_Id", reference_Id);
      })
      .addCase(register.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.errorMessage = action.payload;
      })

      .addCase(logout.pending, (state, action) => {
        state.logoutStatus = "loading";
      })
      .addCase(logout.fulfilled, (state, action) => {
        const { message } = action.payload;
        state.logoutStatus = "succeeded";
        state.message = message;
      })
      .addCase(logout.rejected, (state, action) => {
        const {
          error: { message, code },
        } = action.payload;
        state.logoutStatus = "failed";
        state.errorMessage = message;
        state.code = code;
      })

      .addCase(verifyEmail.pending, (state) => {
        state.verifyEmailStatus = "loading";
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        const { message } = action.payload;
        state.verifyEmailStatus = "succeeded";
        state.message = message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        const {
          error: { message, code },
        } = action.payload;
        state.verifyEmailStatus = "failed";
        state.errorMessage = message;
        state.code = code;
      })

      .addCase(updatePassword.pending, (state) => {
        state.updatePasswordStatus = "loading";
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        const { message } = action.payload;
        state.updatePasswordStatus = "succeeded";
        state.message = message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        const {
          error: { message, code },
        } = action.payload;
        state.updatePasswordStatus = "failed";
        state.errorMessage = message;
        state.code = code;
      })

      .addCase(getVerificationToken.pending, (state) => {
        state.verificationTokenStatus = "loading";
      })
      .addCase(getVerificationToken.fulfilled, (state, action) => {
        const {
          data: { token },
          message,
        } = action.payload;
        state.verificationTokenStatus = "succeeded";
        state.message = message;
        localStorage.setItem("verificationToken", token);
      })
      .addCase(getVerificationToken.rejected, (state, action) => {
        const {
          error: { message, code },
        } = action.payload;
        state.verificationTokenStatus = "failed";
        state.errorMessage = message;
        state.code = code;
      })

      .addCase(_getUser.pending, (state) => {
        state._userDetailsStatus = "loading";
      })
      .addCase(_getUser.fulfilled, (state, action) => {
        state._userDetailsStatus = "succeeded";
        state._userDetails = action.payload;
      })
      .addCase(_getUser.rejected, (state, action) => {
        state._userDetailsStatus = "failed";
      })

      .addCase(getUser.pending, (state) => {
        state.userDetailsStatus = "loading";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userDetailsStatus = "succeeded";
        state.userDetails = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.userDetailsStatus = "failed";
      })

      .addCase(updateUserImage.pending, (state) => {
        state.userImageStatus = "loading";
      })
      .addCase(updateUserImage.fulfilled, (state, action) => {
        state.userImageStatus = "succeeded";
      })
      .addCase(updateUserImage.rejected, (state, action) => {
        state.userImageStatus = "failed";
      })

      .addCase(isFollowing.pending, (state) => {
        state.isFollowingStatus = "loading";
      })
      .addCase(isFollowing.fulfilled, (state, action) => {
        state.isFollowingStatus = "succeeded";
        state.isFollowing = action.payload?.isFollowing;
      })
      .addCase(isFollowing.rejected, (state, action) => {
        state.isFollowingStatus = "failed";
      })

      .addCase(peopleToFollow.pending, (state) => {
        state.peopleToFollowStatus = "loading";
      })
      .addCase(peopleToFollow.fulfilled, (state, action) => {
        const { followers, numb_found } = action.payload;
        state.peopleToFollowStatus = "succeeded";
        state.followQ = [...state.followQ, ...followers];
        state.hasMoreFollows = numb_found;
      })
      .addCase(peopleToFollow.rejected, (state, action) => {
        state.peopleToFollowStatus = "failed";
      })

      .addCase(follow.pending, (state) => {
        state.followStatus = "loading";
      })
      .addCase(follow.fulfilled, (state, action) => {
        state.followStatus = "succeeded";
        state.isFollowing = action.payload?.follow;
      })
      .addCase(follow.rejected, (state, action) => {
        state.followStatus = "failed";
      });
  },
});

export const {
  setAuthData,
  clearAuthData,
  clearError,
  clearAuthMessage,
  clearAuthErrorMessage,
} = authSlice.actions;
export default authSlice.reducer;
