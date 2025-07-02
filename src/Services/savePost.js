import axiosInstance from "./AxiosInstance";

// Function to save post
async function savePost(post_id, formData) {
  try {
    const response = await axiosInstance.post(
      `/toggle-save/${post_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to get saved post history
async function savedPostHistory(user_id) {
  try {
    const response = await axiosInstance.get(`/saved-history/${user_id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to get unsaved post history
async function unSavePostHistory(post_id, user_id) {
  try {
    const response = await axiosInstance.delete(
      `/delete-saved/${user_id}/one/${post_id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to add like
export const SavedService = {
  savePost,
  savedPostHistory,
  unSavePostHistory,
};
