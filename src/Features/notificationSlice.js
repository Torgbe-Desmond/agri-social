import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    updateNotificationList: (state, action) => {
      const { notifications } = action.payload;
      state.notifications = [...state.notifications, ...notifications];
    },
    removeDeletedNotification: (state, action) => {
      const idToDelete = action.payload?.notification_id;
      if (!idToDelete) return;

      state.notifications = state.notifications?.filter(
        (p) => p.id !== idToDelete
      );
    },
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
  },

  extraReducers: (builder) => {},
});

export const {
  updateReadNofitications,
  updateNotificationList,
  removeDeletedNotification,
} = notificationSlice.actions;
export default notificationSlice.reducer;
