import axiosInstance from "./AxiosInstance";

// Function to get notifications
async function getNofitications(user_id, offset, limit) {
  try {
    const response = await axiosInstance.get(`/get-notifications/${user_id}`, {
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

export const notificationService = {
  getNofitications,
};
