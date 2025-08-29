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
  }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ offset, limit }) =>
        `/notifications/notifications?offset=${offset}&limit=${limit}`,
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
        url: "/notifications/read",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result) =>
        result?.updated
          ? result.updated.map((id) => ({ type: "Notification", id }))
          : [],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useReadNotificationMutation,
} = notificationApi;
