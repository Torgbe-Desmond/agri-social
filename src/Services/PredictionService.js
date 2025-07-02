import axiosInstance from "./AxiosInstance";
import axios from "axios";

// Function to create a post
async function predictImage(formData) {
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  try {
    const response = await axiosInstance.post(`/prediction`, formData, {
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

// Function to predict image in post
async function predictImageInPost(formData) {
  try {
    const response = await axiosInstance.post(`/prediction-disease-image`, formData, {
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

// async function getPlantInfo(apiKey, latitude, longitude, images = [], kind) {
//   try {
//     const typeOfKink = {
//       identify: "identification",
//       health: "health_assessment",
//     };

//     const response = await axios.post(
//       `https://plant.id/api/v3/${typeOfKink[]}`,
//       {
//         latitude: latitude,
//         longitude: longitude,
//         similar_images: true,
//         images: images, // images should be an array of Base64 strings
//       },
//       {
//         headers: {
//           "Api-Key": apiKey,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Plant Health Assessment Result:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error during plant health assessment:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// Function To Delete Prediction
async function deletePrediction(prediction_id) {
  try {
    const response = await axiosInstance.delete(
      `/delete-prediction/${prediction_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to get a post
async function getPredictions(user_id) {
  try {
    const response = await axiosInstance.get(`/prediction-history/${user_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const PredictionService = {
  predictImage,
  getPredictions,
  deletePrediction,
  predictImageInPost,
};
