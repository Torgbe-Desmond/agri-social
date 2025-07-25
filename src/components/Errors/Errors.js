// ErrorContext.js
import React, {
  createContext,
  useEffect,
  useContext,
  useState,
} from "react";
import axiosInstance from "../../Services/AxiosInstance";

// Create context with shape { message, setMessage }
const ErrorContext = createContext({
  message: null,
  setMessage: () => {},
});

// Custom hook for easy access
export const useError = () => useContext(ErrorContext);

// Provider
export const ErrorProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          const msg = error.response.data?.detail || "Unauthorized";
          setMessage(msg);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);   

  return (
    <ErrorContext.Provider value={{ message, setMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};
