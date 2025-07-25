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

async function getMessagedUsers() {
  try {
    const response = await axiosInstance.post(`/get-messaged-users`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to add a message
async function getConversation() {
  try {
    const response = await axiosInstance.post(`/get-conversation`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to add a message
async function getGroupConversation(formData) {
  try {
    const response = await axiosInstance.post(
      `/get-group-conversations`,
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

async function conversing(formData) {
  try {
    const response = await axiosInstance.post(`/conversing`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function createConversation(formData) {
  try {
    const response = await axiosInstance.post(
      `/create-conversation`,
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

// Function to add a message
async function createGroup(formData) {
  try {
    const response = await axiosInstance.post(
      `/create-group-conversation`,
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

export const ConversationService = {
  sendMessage,
  getMessages,
  getConversation,
  getMessagedUsers,
  getGroupConversation,
  createGroup,
  conversing,
  createConversation,
};
