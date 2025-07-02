import axiosInstance from "./AxiosInstance";

async function addLike(post_id,formData) {
    try {
        const response = await axiosInstance.post(`/toggle-like/${post_id}`,formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

// Function to add like
export const likeService = {
    addLike
}