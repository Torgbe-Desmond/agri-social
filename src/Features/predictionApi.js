// src/redux/services/predictionApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from './Api';

export const predictionApi = createApi({
  reducerPath: 'predictionApi',
  baseQuery: fetchBaseQuery({ baseUrl: Api }),
  tagTypes: ['Prediction', 'PredictionList'],
  endpoints: (builder) => ({
    predictImage: builder.mutation({
      query: (formData) => ({
        url: `/predict`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['PredictionList'],
    }),

    predictImageInPost: builder.mutation({
      query: (formData) => ({
        url: `/predict/image-in-post`,
        method: 'POST',
        body: formData,
      }),
    }),

    getPredictions: builder.query({
      query: () => `/predictions`,
      providesTags: ['PredictionList'],
    }),

    deletePrediction: builder.mutation({
      query: (prediction_id) => ({
        url: `/predictions/${prediction_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PredictionList'],
    }),
  }),
});

export const {
  usePredictImageMutation,
  usePredictImageInPostMutation,
  useGetPredictionsQuery,
  useDeletePredictionMutation,
} = predictionApi;
