import axiosInstance from "./AxiosInstance";

// Function to get notifications
async function getNofitications(offset, limit) {
  try {
    const response = await axiosInstance.get(`/get-notifications`, {
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

async function readNofitications(formData) {
  try {
    const response = await axiosInstance.post(`/read-notifications`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const notificationService = {
  getNofitications,
  readNofitications,
};
