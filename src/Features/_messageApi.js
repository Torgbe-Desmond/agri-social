// services/conversationApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Api } from "./Api";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
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
  tagTypes: ["Conversation", "Group", "User", "Message"],
  endpoints: (builder) => ({
    createConversation: builder.mutation({
      query: (formData) => ({
        url: `/conversation/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Conversation"],
    }),
    conversing: builder.mutation({
      query: (formData) => ({
        url: `/conversation/conversing`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Conversation"],
    }),
    createGroup: builder.mutation({
      query: (formData) => ({
        url: `/conversation/groups/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Group"],
    }),
    getGroup: builder.query({
      query: () => `/conversation/group`,
      providesTags: ["Group"],
    }),
    joinGroup: builder.mutation({
      query: (formData) => ({
        url: `/conversation/join-group`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Group"],
    }),
    getMessagedUsers: builder.query({
      query: () => `/conversation/users`,
      providesTags: ["User"],
    }),
    getMessages: builder.query({
      query: (conversation_id) => `/conversation/${conversation_id}/messages`,
      providesTags: (result, error, conversation_id) => [
        { type: "Message", id: conversation_id },
      ],
    }),
    following: builder.query({
      query: (user_id) => `/user/following/${user_id}`,
      providesTags: ["User"],
    }),
    follow: builder.mutation({
      query: (formData) => ({
        url: `/user/follow`,
        method: "POST",
        body: formData,
      }),
    }),
    sendMessage: builder.mutation({
      query: (formData) => ({
        url: `/conversation/send`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { conversation_id }) => [
        { type: "Message", id: conversation_id },
      ],
    }),
  }),
});

export const {
  useCreateConversationMutation,
  useConversingMutation,
  useCreateGroupMutation,
  useGetGroupQuery,
  useJoinGroupMutation,
  useGetMessagedUsersQuery,
  useGetMessagesQuery,
  useFollowingQuery,
  useFollowMutation,
  useSendMessageMutation,
} = conversationApi;
