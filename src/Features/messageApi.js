// services/conversationApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Api } from "./Api";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Api,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }), // Adjust as needed
  tagTypes: ["Conversation", "Group", "User", "Message"],
  endpoints: (builder) => ({
    getConversation: builder.query({
      query: ({ formData }) => ({
        url: `/conversation`,
        method: "POST",
        body: formData,
      }),
      providesTags: ["Conversation"],
    }),
    getGroupConversation: builder.query({
      query: () => `/conversation/group`,
      providesTags: ["Group"],
    }),
    createConversation: builder.mutation({
      query: ({ formData }) => ({
        url: `/conversation/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Conversation"],
    }),
    conversing: builder.mutation({
      query: ({ formData }) => ({
        url: `/conversation/conversing`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Conversation"],
    }),
    createGroup: builder.mutation({
      query: ({ formData }) => ({
        url: `/conversation/groups/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Group"],
    }),
    getMessagedUsers: builder.query({
      query: () => `/conversation/users`,
      providesTags: ["User", "Conversation", "Message"],
    }),
    getMessages: builder.query({
      query: (conversation_id) => `/conversation/${conversation_id}/messages`,
      providesTags: (result, error, conversation_id) => [
        { type: "Message", id: conversation_id },
      ],
    }),
    following: builder.query({
      query: ({ user_id }) => `/following/${user_id}`,
      providesTags: (result, error, conversation_id) => [
        { type: "Message", id: conversation_id },
      ],
    }),
    follow: builder.mutation({
      query: ({ formData }) => ({
        url: `/follow`,
        method: "POST",
        body: formData,
      }),
    }),
    sendMessage: builder.mutation({
      query: ({ formData }) => ({
        url: `/conversation/send`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { conversation_id }) => [
        { type: "Message", id: conversation_id },
        { type: "Conversation", id: conversation_id },
      ],
    }),
    requestJoinGroup: builder.mutation({
      query: ({ formData }) => ({
        url: `/request-join-group-conversation`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { conversation_id }) => [
        { type: "Message", id: conversation_id },
        { type: "Conversation", id: conversation_id },
      ],
    }),
    joinGroup: builder.mutation({
      query: ({ formData }) => ({
        url: `/join-group-conversation`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { conversation_id }) => [
        { type: "Message", id: conversation_id },
        { type: "Conversation", id: conversation_id },
      ],
    }),
  }),
});

export const {
  useGetConversationQuery,
  useGetGroupConversationQuery,
  useCreateConversationMutation,
  useConversingMutation,
  useFollowMutation,
  useCreateGroupMutation,
  useGetMessagedUsersQuery,
  useGetMessagesQuery,
  useFollowingQuery,
  useSendMessageMutation,
  useJoinGroupMutation,
  useRequestJoinGroupMutation
} = messageApi;
