import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";
import toast from "react-hot-toast";

interface LoginParams {
  email: string;
  password: string;
}

export const handle_Auth = {
  /**
   * Performs a dual-attempt login. 
   * First tries Admin; if unauthorized/not found, tries Collector.
   */
  login: async ({ email, password }: LoginParams) => {
    const loadingToast = toast.loading("Authenticating...");
    const loginData = { email, password };

    try {
      // 1. Attempt Admin Login
      try {
        const adminRes = await apiClient.post(ENDPOINTS.AUTH.ADMIN_LOGIN, loginData);
        toast.success("Welcome, Administrator", { id: loadingToast });
        return { ...adminRes.data, loginType: 'admin' }; 
      } catch (adminErr: any) {
        const status = adminErr?.response?.status;

        // 2. If Admin fails with 401/404/403, attempt Collector Login
        if (status === 401 || status === 404 || status === 403) {
          const collectorRes = await apiClient.post(ENDPOINTS.AUTH.COLLECTOR_LOGIN, loginData);
          toast.success("Login Successful", { id: loadingToast });
          return { ...collectorRes.data, loginType: 'collector' };
        }
        
        // If it's another error (like 500), throw it to the main catch
        throw adminErr;
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Invalid credentials or server error";
      toast.error(errorMsg, { id: loadingToast });
      
      return error?.response?.data || { status: false, message: errorMsg };
    }
  },

  /**
   * Logs out the user and clears the session
   */
  logout: async () => {
    const loadingToast = toast.loading("Logging out...");
    try {
      // apiClient handles the Authorization: Bearer token automatically via interceptors
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
      
      if (response.data?.status || response.status === 200) {
        toast.success("Logged out successfully", { id: loadingToast });
        return response.data;
      }
      throw new Error("Logout failed");
    } catch (error: any) {
      console.error("LOGOUT ERROR:", error?.response?.data || error.message);
      
      // Even if the API call fails, we usually want to tell the user they logged out locally
      toast.error("Session ended", { id: loadingToast });
      return { status: false, message: "Logout failed" };
    }
  }
};