import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationService } from "../Services/notificationService";

const initialState = {
  notifications: [],
  notificationStatus: "idle",
  readNotifcationStatus: "idle",
  notificationOffset: 1,
  hasMore: true,
  message: "",
};

export const getNofitications = createAsyncThunk(
  "notification/getNofitications",
  async ({ offset, limit }, thunkAPI) => {
    try {
      const response = await notificationService.getNofitications(
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

export const readNotification = createAsyncThunk(
  "notification/readNotification",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await notificationService.readNofitications(formData);
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
    setNotificationOffset: (state) => {
      state.notificationOffset = state.notificationOffset + 1;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getNofitications.pending, (state) => {
        state.notificationStatus = "loading";
      })
      .addCase(getNofitications.fulfilled, (state, action) => {
        const { notifications, numb_found } = action.payload;
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
      })

      .addCase(readNotification.pending, (state) => {
        state.readNotifcationStatus = "loading";
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        const { updated } = action.payload;
        state.notifications = state.notifications.map((n) => {
          if (updated?.includes(n.id)) {
            return {
              ...n,
              is_read: 1,
            };
          }
          return n;
        });
        state.readNotifcationStatus = "succeeded";
      })
      .addCase(readNotification.rejected, (state, action) => {
        state.hasMore = false;
        state.readNotifcationStatus = "failed";
        state.message = action.payload;
      });
  },
});

export const {
  updateReadNofitications,
  clearNotificationData,
  clearHasMore,
  setNotificationOffset,
} = notificationSlice.actions;
export default notificationSlice.reducer;
