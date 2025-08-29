// src/redux/services/productApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Api } from "./Api";

export const productApi = createApi({
  reducerPath: "productApi",
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
  tagTypes: ["Product", "ProductList", "Reviews"],
  endpoints: (builder) => ({
    // =================== PRODUCT ENDPOINTS ===================
    getProducts: builder.query({
      query: ({ offset, limit }) => `/products?offset=${offset}&limit=${limit}`,
      providesTags: (result = []) =>
        result.products?.map(({ product_id }) => ({
          type: "Product",
          id: product_id,
        })) || [],
    }),
    getProduct: builder.query({
      query: ({ product_id }) => `/products/${product_id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getUserProducts: builder.query({
      query: () => `/products/user/`,
      providesTags: ["ProductList"],
    }),
    createProduct: builder.mutation({
      query: (formData) => ({
        url: `/products/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ProductList"],
    }),
    updateProduct: builder.mutation({
      query: ({ product_id, formData }) => ({
        url: `/products/${product_id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { product_id }) => [
        { type: "Product", id: product_id },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (product_id) => ({
        url: `/products/${product_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    // =================== REVIEW ENDPOINTS ===================
    getReviews: builder.query({
      query: ({ product_id, offset, limit }) =>
        `/products/products/reviews/${product_id}?offset=${offset}&limit=${limit}`,
      providesTags: (result, error, id) => [{ type: "Reviews", id }],
    }),
    createReview: builder.mutation({
      query: ({ product_id, formData }) => ({
        url: `/products/products/reviews/${product_id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { product_id }) => [
        { type: "Reviews", id: product_id },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetUserProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetReviewsQuery,
  useCreateReviewMutation,
} = productApi;
