import axios from "axios";
import SuccessMessage from "../components/SuccessMessage/SuccessMessage";
import { errorMap } from "../components/Errors/ErrorStatus";
import { Alert } from "@mui/material";
const url = [
  "https://agri-social-backend.onrender.com",
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
    const token = localStorage.getItem("access_token"); // or whatever key you use
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    console.log(error);
    if (error) {
      console.log(error.response.status === 401);

      throw error;
    }
  }
);

export default axiosInstance;
