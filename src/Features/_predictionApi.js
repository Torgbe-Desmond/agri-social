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
        url: `/predictions`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["PredictionList"],
    }),
    getPredictions: builder.query({
      query: () => `/predictions`,
      providesTags: ["PredictionList"],
    }),

    deletePrediction: builder.mutation({
      query: ({ prediction_id }) => ({
        url: `/predictions/${prediction_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PredictionList"],
    }),
  }),
});

export const {
  usePredictImageMutation,
  useGetPredictionsQuery,
  useDeletePredictionMutation,
} = predictionApi;
