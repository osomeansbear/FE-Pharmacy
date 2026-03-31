import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
// 1. Create an Axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 giây
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 3. Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      const serverMessage = error.response.data?.message;
      switch (error.response.status) {
        case 400:
          console.error("Bad request:", serverMessage || "Invalid request data.");
          break;
        case 401:
          console.error("Unauthorized. Please log in again.");
          break;
        case 403:
          console.error("You do not have permission to access this resource.");
          break;
        case 404:
          console.error("Resource not found.");
          break;
        case 500:
          console.error("Internal server error.");
          break;
        default:
          console.error("Request failed:", serverMessage || error.message);
      }
    } else if (error.request) {
      console.error("No response received from the server.");
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
