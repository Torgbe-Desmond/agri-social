import axiosInstance from "./AxiosInstance";

// Function to add a comment
async function addComment(formData, post_id) {
  try {
    const response = await axiosInstance.post(
      `/add-comment/${post_id}`,
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

// Function to add a comment
async function addReplyComment(formData, comment_id) {
  try {
    const response = await axiosInstance.post(
      `/add-reply-comment/${comment_id}`,
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

// Function tp get all comments related to a particular post
async function geComments(post_id) {
  try {
    const response = await axiosInstance.get(`/get-comments/${post_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function tp get comment
async function geComment(comment_id) {
  try {
    const response = await axiosInstance.get(`/get-comment/${comment_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to get comment related to a particular comment
async function getCommentParent(parent_id) {
  try {
    const response = await axiosInstance.get(`/get-comment/${parent_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to like comment
async function addCommentLike(comment_id, formData) {
  try {
    const response = await axiosInstance.post(
      `/toggle-comment-like/${comment_id}`,
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

export const CommentService = {
  geComments,
  addComment,
  geComment,
  getCommentParent,
  addCommentLike,
  addReplyComment,
};
