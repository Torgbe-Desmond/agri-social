import axiosInstance from "./AxiosInstance";

// Function to create a product
async function createProduct(formData) {
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  try {
    const response = await axiosInstance.post(`/create-products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function fetchProducts(offset = 1, limit = 10) {
  try {
    const response = await axiosInstance.get(`/products`, {
      params: {
        offset,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchProduct(product_id) {
  try {
    const response = await axiosInstance.get(`/product/${product_id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchUserProducts() {
  try {
    const response = await axiosInstance.get(`/user-products`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function searchProduct(query) {
  const response = await axiosInstance.get("/search-products", {
    params: { query },
  });
  return response.data;
}

// Function to update a product
async function updateProduct(product_id, formData) {
  try {
    const response = await axiosInstance.put(
      `/update-products/${product_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// // Function tp get post
// async function searchProducts(post_id) {
//   try {
//     const response = await axiosInstance.get(`/get-single-post/${post_id}`);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// Function to get delete post
async function deleteProduct(product_id) {
  try {
    const response = await axiosInstance.delete(
      `/delete-product/${product_id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const ProductService = {
  deleteProduct,
  createProduct,
  fetchUserProducts,
  updateProduct,
  fetchProducts,
  searchProduct,
  fetchProduct,
};
