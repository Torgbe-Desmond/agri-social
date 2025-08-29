// services/commentApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Api } from "./Api";

export const commentApi = createApi({
  reducerPath: "commentApi",
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
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getComments: builder.query({
      query: (post_id) => `/comments/${post_id}`,
      providesTags: (result) =>
        result
          ? [
              ...result.comments.map(({ id }) => ({ type: "Comment", id })),
              { type: "Comment", id: "LIST" },
            ]
          : [{ type: "Comment", id: "LIST" }],
    }),
    getComment: builder.query({
      query: (comment_id) => `/comments/${comment_id}/comment`,
      providesTags: (result, error, id) => [{ type: "Comment", id }],
    }),
    getReplies: builder.query({
      query: (comment_id) => `/comments/${comment_id}/replies`,
      providesTags: (result) =>
        result
          ? [...result.comments.map(({ id }) => ({ type: "Comment", id }))]
          : [],
    }),
    addComment: builder.mutation({
      query: ({ post_id, formData }) => ({
        url: `/comments/${post_id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Comment", id: "LIST" }],
    }),
    addReplyComment: builder.mutation({
      query: ({ comment_id, formData }) => ({
        url: `/comments/${comment_id}/replies`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { comment_id }) => [
        { type: "Comment", id: comment_id },
      ],
    }),
    likeComment: builder.mutation({
      query: ({ comment_id, formData }) => ({
        url: `/comments/${comment_id}/like`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(
        { comment_id },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            commentApi.util.invalidateTags([{ type: "Comment", id: comment_id }])
          );
        } catch (err) {
          // optional error handling
        }
      },
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetCommentQuery,
  useGetRepliesQuery,
  useAddCommentMutation,
  useAddReplyCommentMutation,
  useLikeCommentMutation,
} = commentApi;
