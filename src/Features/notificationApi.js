import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Api } from "./Api";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Api,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }), // Change baseUrl accordingly
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ offset, limit }) =>
        `notifications?offset=${offset}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.notifications.map(({ id }) => ({
                type: "Notification",
                id,
              })),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),
    readNotification: builder.mutation({
      query: (formData) => ({
        url: "notifications/read",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => {
        // Invalidate updated notifications
        return result?.updated
          ? result.updated.map((id) => ({ type: "Notification", id }))
          : [];
      },
    }),
    deleteNotification: builder.mutation({
      query: (formData) => ({
        url: "notifications/delete",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) =>
        result?.deleted ? [{ type: "Notification", id: result.deleted }] : [],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;
