import axiosInstance from "./AxiosInstance";

// Function to create a post
async function createPost(formData) {
  try {
    const response = await axiosInstance.post(`/create-post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getPosts(offset = 1, limit = 10) {
  try {
    const response = await axiosInstance.get(`/get-posts`, {
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

async function getStreams(offset = 1, limit = 10) {
  try {
    const response = await axiosInstance.get(`/get-streams`, {
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

// Function tp get post
async function getPost(post_id) {
  try {
    const response = await axiosInstance.get(`/get-single-post/${post_id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to get post history
async function getPostHistory(offset = 1, limit = 10) {
  try {
    const response = await axiosInstance.get(`/post-history`, {
      params: {
        offset,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getUserPostHistory(user_id, offset = 1, limit = 10) {
  try {
    const response = await axiosInstance.get(`/user-post-history/${user_id}`, {
      params: {
        offset,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to get delete post
async function deletePost(post_id) {
  try {
    const response = await axiosInstance.delete(`/delete-post/${post_id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const PostService = {
  createPost,
  getPostHistory,
  getPosts,
  getPost,
  deletePost,
  getStreams,
  getUserPostHistory,
};
