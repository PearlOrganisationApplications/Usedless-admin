import axios from "axios";
import { BASE_URL } from "./endpoints"; // Ensure this matches your path
import { getTokens } from "./auth/tokens"; // Ensure this matches your path

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// REQUEST Interceptor: Attach token automatically
apiClient.interceptors.request.use(async (config) => {
  const tokenPair = await getTokens();
  if (tokenPair?.token) {
    config.headers.Authorization = `Bearer ${tokenPair.token}`;
  }
  config.headers.Accept = "application/json";
  return config;
});

// RESPONSE Interceptor: Handle Global Errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Check if this is a login attempt
    const isLoginRequest = url.includes("login") || url.includes("temp-login");

    // 401: Unauthorized (Token expired or invalid)
    if (status === 401 && !isLoginRequest) {
      console.warn("Session expired or unauthorized. Logging out...");

      // Clear session data
      if (typeof window !== "undefined") {
        localStorage.clear();
        // Redirect to login/home
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }

    // 403: Forbidden (Role doesn't have permission)
    if (status === 403 && !isLoginRequest) {
      console.error("Access Denied: Permission issues.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;