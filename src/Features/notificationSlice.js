import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationService } from "../Services/notificationService";

const initialState = {
  notifications: [],
  notificationStatus: "idle",
  hasMore: true,
};

export const getNofitications = createAsyncThunk(
  "notification/getNofitications",
  async ({ user_id, offset, limit }, thunkAPI) => {
    try {
      const response = await notificationService.getNofitications(
        user_id,
        offset,
        limit
      );
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    updateReadNofitications: (state, action) => {
      const { read_notifications } = action.payload;
      state.notifications = state.notifications.map((n) => {
        if (read_notifications.includes(n.id)) {
          return {
            ...n,
            is_read: 1,
          };
        }
        return n;
      });
    },
    clearNotificationData: (state) => {
      state.notifications = [];
    },
    clearHasMore: (state) => {
      state.hasMore = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getNofitications.pending, (state) => {
        state.notificationStatus = "loading";
      })
      .addCase(getNofitications.fulfilled, (state, action) => {
        // const { notifications, numb_found } = action.payload;

        // // First update `hasMore`
        // state.hasMore = notifications.length > 0 && notifications.length >= 10;

        // // Then append based on actual result
        // if (notifications.length > 0) {
        //   state.notifications = [...state.notifications, ...notifications];
        // }

        // state.notificationStatus = "succeeded";

        const { notifications, numb_found } = action.payload;
        console.log(notifications);
        state.hasMore = notifications.length > 0;

        if (state.hasMore) {
          const existingIds = new Set(
            state.notifications.map((notification) => notification.id)
          );
          const newNotification = notifications.filter(
            (notification) => !existingIds.has(notification.id)
          );
          state.notifications = [...state.notifications, ...newNotification];
        }

        state.notificationStatus = "succeeded";
      })
      .addCase(getNofitications.rejected, (state) => {
        state.hasMore = false;
        state.notificationStatus = "failed";
      });
  },
});

export const { updateReadNofitications, clearNotificationData, clearHasMore } =
  notificationSlice.actions;
export default notificationSlice.reducer;
