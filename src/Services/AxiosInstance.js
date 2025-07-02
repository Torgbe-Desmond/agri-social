import axios from "axios";
import SuccessMessage from "../components/SuccessMessage/SuccessMessage";
import { errorMap } from "../components/Errors/ErrorStatus";
import { Alert } from "@mui/material";
const url = [
  "https://file-transfer-app-backend.onrender.com/api/v1",
  "http://localhost:8000",
];

// Create an Axios instance

export const axiosInstance = axios.create({
  baseURL: url[1],
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log("configuration error", error);
  }
);

function LogMessage(message) {
  alert(message);
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error) {
      console.log(error);

      throw error;
    }
  }
);

export default axiosInstance;
