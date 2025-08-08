import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["UserSearch"],
  endpoints: (builder) => ({
    searchUser: builder.query({
      query: ({ username, offset, limit }) =>
        `/search/users?username=${username}&offset=${offset}&limit=${limit}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "UserSearch", id })),
              { type: "UserSearch", id: "LIST" },
            ]
          : [{ type: "UserSearch", id: "LIST" }],
    }),
    // Example mutation that invalidates search results cache
    updateUser: builder.mutation({
      query: (user) => ({
        url: `/users/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: [{ type: "UserSearch", id: "LIST" }],
    }),
  }),
});

export const { useSearchUserQuery, useUpdateUserMutation } = searchApi;
