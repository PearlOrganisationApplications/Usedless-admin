import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";
import toast from "react-hot-toast";

/**
 * Enhanced user management logic
 * File Name: mange_user.ts
 */
export const handle_user = {
  /**
   * Fetches the list of all users.
   * Endpoint: /useless/public/api/get/user
   */
  getUsers: async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.USER.GET_ALL);
      // Returns the data array which contains the 'locations' and stats
      return res.data?.data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  /**
   * Updates user status (Block/Unblock).
   * Endpoint: /useless/public/api/user/toggle-status
   * @param userId - ID of the user
   * @param newStatus - 1 for Unblock (Active), 0 for Block
   */
  toggleUserStatus: async (userId: number, newStatus: number) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      const res = await apiClient.post(ENDPOINTS.USER.TOGGLE_STATUS, {
        user_id: userId,
        status: newStatus,
      });

      if (res.data?.status) {
        toast.success(
          newStatus === 1 ? "User Unblocked Successfully" : "User Blocked Successfully",
          { id: loadingToast }
        );
        return res.data;
      } else {
        throw new Error(res.data?.message || "Failed to update status");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to update user status";
      toast.error(errorMsg, { id: loadingToast });
      throw error;
    }
  },
};