import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Api } from "./Api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Api,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("verification_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (build) => ({
    login: build.mutation({
      query: ({ formData }) => ({
        url: "/auth/login",
        method: "POST",
        body: formData,
      }),
    }),
    register: build.mutation({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
      }),
    }),
    sendVerificationEmail: build.mutation({
      query: ({ formData }) => ({
        url: "/auth/send-verification-email",
        method: "POST",
        body: formData,
      }),
    }),
    updatePassword: build.mutation({
      query: ({ formData }) => ({
        url: "/auth/update-password",
        method: "PUT",
        body: formData,
      }),
    }),
    getVerificationToken: build.query({
      query: (verification_string) =>
        `/auth/generate-verification-token/${verification_string}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendVerificationEmailMutation,
  useUpdatePasswordMutation,
  useGetVerificationTokenQuery,
} = authApi;
