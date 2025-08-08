// src/redux/slices/productSlice.js
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    searchResults: [],
    localProducts: [],
  },
  reducers: {
    removeDeletedProduct: (state, action) => {
      const idToDelete = action.payload?.product_id;
      if (!idToDelete) return;

      state.products = state.products?.filter((p) => p.id !== idToDelete);
    },
    updateProductList: (state, action) => {
      const { products } = action.payload;
      state.products = [...state.products, ...products];
    },
    addNewProduct: (state, action) => {
      state.products.unshift(action.payload);
    },
    updateLocalProductList: (state, action) => {
      const { products } = action.payload;
      state.localProducts = [...state.localProducts, ...products];
    },
  },
  extraReducers: (builder) => {},
});

export const {
  updateProductList,
  updateLocalProductList,
  removeDeletedProduct,
  addNewProduct,
} = productSlice.actions;
export default productSlice.reducer;
