import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
// 1. Tạo Instance với cấu hình mặc định
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 giây
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: Chèn Token vào Header trước khi gửi đi
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token"); // Hoặc lấy từ Cookie/Redux
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Xử lý dữ liệu và lỗi tập trung
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về trực tiếp data để bên ngoài không cần .data nữa
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Xử lý các mã lỗi HTTP phổ biến
      switch (error.response.status) {
        case 401:
          console.error("Hết hạn phiên làm việc, vui lòng đăng nhập lại.");
          // Logic logout hoặc redirect về login ở đây
          break;
        case 403:
          console.error("Bạn không có quyền truy cập.");
          break;
        case 404:
          console.error("Không tìm thấy tài nguyên.");
          break;
        case 500:
          console.error("Lỗi máy chủ nội bộ.");
          break;
        default:
          console.error("Đã xảy ra lỗi không xác định.");
      }
    } else if (error.request) {
      console.error("Không nhận được phản hồi từ máy chủ.");
    } else {
      console.error("Lỗi thiết lập request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
