import axiosInstance from "./AxiosInstance";

// Function to send a message
async function sendMessage(formData) {
  try {
    const response = await axiosInstance.post(`/messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to send a message
async function getMessages(conversation_id) {
  try {
    const response = await axiosInstance.get(`/get-messages`, {
      params: { conversation_id },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getMessagedUsers(formData) {
  try {
    const response = await axiosInstance.post(`/get-messaged-users`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to add a message
async function getConversation(formData) {
  try {
    const response = await axiosInstance.post(`/get-conversation`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to add a message
async function createC(formData, post_id) {
  try {
    const response = await axiosInstance.get(`/get-conversation`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const ConversationService = {
  sendMessage,
  getMessages,
  getConversation,
  getMessagedUsers,
};
