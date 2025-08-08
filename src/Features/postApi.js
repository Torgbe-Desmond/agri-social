// services/postApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Api } from "./Api";

export const postApi = createApi({
  reducerPath: "postApi",
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
  tagTypes: ["Post", "Stream", "Comment", "UserPosts", "Saved"],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ offset, limit }) => `/posts?offset=${offset}&limit=${limit}`,
      providesTags: (result) =>
        result?.posts.map((p) => ({ type: "Post", id: p.post_id })) || [],
    }),
    getStreams: builder.query({
      query: ({ offset, limit }) => `/streams?offset=${offset}&limit=${limit}`,
      providesTags: (result) =>
        result?.posts.map((p) => ({ type: "Stream", id: p.post_id })) || [],
    }),
    getPost: builder.query({
      query: (post_id) => `/posts/${post_id}`,
      providesTags: (result) =>
        result ? [{ type: "Post", id: result.post_id }] : [],
    }),
    createPost: builder.mutation({
      query: ({ formData }) => ({
        url: "/posts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    deletePost: builder.mutation({
      query: (post_id) => ({ url: `/posts/${post_id}`, method: "DELETE" }),
      invalidatesTags: (result, error, post_id) => [
        { type: "Post", id: post_id },
      ],
    }),

    likePost: builder.mutation({
      query: ({ post_id, formData }) => ({
        url: `/posts/${post_id}/like`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { post_id }) => [
        { type: "Post", id: post_id },
      ],
    }),

    // getComments: builder.query({
    //   query: post_id => `/posts/${post_id}/comments`,
    //   providesTags: (result) =>
    //     result?.comments.map(c => ({ type: 'Comment', id: c.id })) || [],
    // }),
    // addComment: builder.mutation({
    //   query: ({ post_id, formData }) => ({
    //     url: `/posts/${post_id}/comments`, method: 'POST', body: formData,
    //   }),
    //   invalidatesTags: (result, error, { post_id }) => [{ type: 'Comment', id: post_id }],
    // }),

    savePost: builder.mutation({
      query: ({ post_id }) => ({
        url: `/saves/${post_id}/save`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { post_id }) => [
        { type: "Post", id: post_id },
      ],
    }),
    unSavePost: builder.mutation({
      query: (post_id) => ({
        url: `/saves/${post_id}/unsave`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, post_id) => [
        { type: "Post", id: post_id },
      ],
    }),

    getSavedHistory: builder.query({
      query: ({ offset, limit }) =>
        `/saves/saved?offset=${offset}&limit=${limit}`,
      providesTags: (result) =>
        result?.posts.map((p) => ({ type: "Saved", id: p.post_id })) || [],
    }),
    getPostHistory: builder.query({
      query: ({ offset, limit }) =>
        `/posts/history?offset=${offset}&limit=${limit}`,
      providesTags: (result) =>
        result?.posts.map((p) => ({ type: "UserPosts", id: p.post_id })) || [],
    }),
    getUserPostHistory: builder.query({
      query: ({ user_id, offset, limit }) =>
        `/users/${user_id}/posts?offset=${offset}&limit=${limit}`,
      providesTags: (result) =>
        result?.posts.map((p) => ({ type: "UserPosts", id: p.post_id })) || [],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetStreamsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useSavePostMutation,
  useUnSavePostMutation,
  useGetSavedHistoryQuery,
  useGetPostHistoryQuery,
  useGetUserPostHistoryQuery,
} = postApi;
