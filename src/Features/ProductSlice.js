// src/redux/slices/productSlice.js
import { createSlice } from "@reduxjs/toolkit";

const mergeUnique = (existing, incoming, key = "product_id") => {
  const map = new Map();
  [...existing, ...incoming].forEach((item) => {
    map.set(item[key], item); 
  });
  return Array.from(map.values());
};

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
      state.products = state.products?.filter((p) => p.product_id !== idToDelete);
    },
    updateProductList: (state, action) => {
      const { products } = action.payload;
      state.products = mergeUnique(state.products, products, "product_id");
    },
    addNewProduct: (state, action) => {
      state.products.unshift(action.payload);
    },
    updateLocalProductList: (state, action) => {
      const { products } = action.payload;
      state.localProducts = mergeUnique(state.localProducts, products, "product_id");
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
