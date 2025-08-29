import { createSlice } from "@reduxjs/toolkit";

const mergeUnique = (existing, incoming, key = "notification_id") => {
  const map = new Map();
  [...existing, ...incoming].forEach((item) => {
    map.set(item[key], item);
  });
  return Array.from(map.values());
};

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    updateNotificationList: (state, action) => {
      const { notifications } = action.payload;
      state.notifications = mergeUnique(
        state.notifications,
        notifications,
        "id"
      );
    },
    removeDeletedNotification: (state, action) => {
      const idToDelete = action.payload?.notification_id;
      if (!idToDelete) return;

      state.notifications = state.notifications?.filter(
        (p) => p.notification_id !== idToDelete
      );
    },
    updateReadNofitications: (state, action) => {
      const { read_notifications } = action.payload;
      state.notifications = state.notifications.map((n) => {
        if (read_notifications.includes(n.notification_id)) {
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
