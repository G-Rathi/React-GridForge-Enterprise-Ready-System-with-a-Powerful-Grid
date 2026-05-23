import axios from "axios";

const axiosInstance = axios.create({
  // Always use VITE_API_URL so client calls the deployed server directly.
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  headers: { "Content-Type": "application/json" }
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (!err.response) {
      err.isConnectionError = true;
      err.data = { message: "Server not reachable" };
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
