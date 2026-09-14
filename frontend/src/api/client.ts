import axios from "axios";
import { AUTH_REFRESH } from "./endpoints";
import { useRouter } from "next/router";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(

  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const router = useRouter();

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== AUTH_REFRESH) {
      originalRequest._retry = true;
      
      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const response = await axios.post(`${baseURL}${AUTH_REFRESH}`, { refresh: refreshToken });
            const newAccessToken = response.data.access;
            
            localStorage.setItem("accessToken", newAccessToken);
            
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return apiClient(originalRequest);
          } catch (refreshError) {
            console.log("Refresh error",refreshError)
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            router.push("/auth/sign-in");

          }
        } else {
            localStorage.removeItem("accessToken");
            router.push("/auth/sign-in");
        }
      }
    }
    return Promise.reject(error);
  }
);

