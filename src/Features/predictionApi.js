// src/redux/services/predictionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Api } from "./Api";

export const predictionApi = createApi({
  reducerPath: "predictionApi",
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
  tagTypes: ["Prediction", "PredictionList"],
  endpoints: (builder) => ({
    predictImage: builder.mutation({
      query: ({ formData }) => ({
        url: `/prediction`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["PredictionList"],
    }),
    predictImageInPost: builder.mutation({
      query: (formData) => ({
        url: `/predict/image-in-post`,
        method: "POST",
        body: formData,
      }),
    }),
    getPredictions: builder.query({
      query: () => `/prediction`,
      providesTags: ["PredictionList"],
    }),

    deletePrediction: builder.mutation({
      query: ({ prediction_id }) => ({
        url: `/delete-prediction/${prediction_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PredictionList"],
    }),
  }),
});

export const {
  usePredictImageMutation,
  usePredictImageInPostMutation,
  useGetPredictionsQuery,
  useDeletePredictionMutation,
} = predictionApi;
