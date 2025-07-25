// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductService } from "../Services/ProductService";
// --- Async Thunks ---

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async ({ offset, limit }, thunkAPI) => {
    try {
      const response = await ProductService.fetchProducts(offset, limit);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async ({ product_id }, thunkAPI) => {
    try {
      const response = await ProductService.fetchProduct(product_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUserProducts = createAsyncThunk(
  "products/fetchUserPrducts",
  async (_, thunkAPI) => {
    try {
      const response = await ProductService.fetchUserProducts();
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/search",
  async ({ query }, thunkAPI) => {
    try {
      const response = await ProductService.searchProduct(query);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async ({ formData }, thunkAPI) => {
    try {
      const response = await ProductService.createProduct(formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ product_id, formData }, thunkAPI) => {
    try {
      const response = await ProductService.updateProduct(product_id, formData);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async ({ product_id }, thunkAPI) => {
    try {
      const response = await ProductService.deleteProduct(product_id);
      return response;
    } catch (error) {
      const message = error?.response?.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Slice ---

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    searchResults: [],
    product: null,
    hasMore: true,
    loading: "idle",
    createProductStatus: "idle",
    searchResultsStatus: "idle",
    deleteProductStatus: "idle",
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearProducts: (state) => {
      state.products = [];
    },
    handleStatus: (state) => {
      state.searchResultsStatus = "idle";
      state.deleteProductStatus = "idle";
      state.loading = "idle";
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch All
      .addCase(fetchProducts.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { products, numb_found } = action.payload;
        state.hasMore = products.length > 0;
        if (state.hasMore) {
          state.products = [...new Set([...state.products, ...products])];
        }
        state.numb_found = numb_found;
        state.loading = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = "failed";
      })

      // Fetch All
      .addCase(fetchUserProducts.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchUserProducts.fulfilled, (state, action) => {
        const { products, numb_found} = action.payload
        state.products = [...new Set([...state.products,...products])];
        state.loading = "succeeded";
      })
      .addCase(fetchUserProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = "failed";
      })

      .addCase(searchProducts.pending, (state) => {
        state.searchResultsStatus = "loading";
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchResults = [...action.payload];
        state.searchResultsStatus = "succeeded";
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.searchResultsStatus = "failed";
      })

      .addCase(fetchProduct.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = "failed";
      })

      //   // Search
      //   .addCase(searchProducts.fulfilled, (state, action) => {
      //     state.products = action.payload;
      //   })

      // Create
      .addCase(createProduct.pending, (state, action) => {
        state.createProductStatus = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products = [...state.products, action.payload];
        state.createProductStatus = "succeeded";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createProductStatus = "failed";
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        // Could re-fetch or update item in-place
      })

      // Delete
      .addCase(deleteProduct.pending, (state, action) => {
        state.deleteProductStatus = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const { product_id } = action.payload;
        state.products = state.products.filter(
          (item) => item.product_id !== product_id
        );
        state.deleteProductStatus = "succeeded";
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        const { product_id } = action.payload;
        state.products = state.products.filter(
          (item) => item.product_id !== product_id
        );
        state.deleteProductStatus = "failed";
      });
  },
});

export const { clearError, clearProducts, handleStatus } = productSlice.actions;
export default productSlice.reducer;
