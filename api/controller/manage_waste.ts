import apiClient from "../apiClient";
import toast from "react-hot-toast";
import { ENDPOINTS } from "../endpoints";

/**
 * Controller for managing waste records and status updates
 */
export const manage_waste = {
  /**
   * Fetches the waste types assigned to the current client/user
   * Endpoint: /useless/public/api/client/watetypes
   */
  getUserWaste: async () => {
    try {
      // FIXED: Used the direct path string to avoid the 404 error
      const res = await apiClient.get("/useless/public/api/client/watetypes");

      if (res.data?.status) {
        return res.data.data || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching user waste:", error);
      // Return empty array instead of throwing to prevent UI crash
      return [];
    }
  },

  /**
   * Updates the status of a specific waste entry
   * Supports: "approved" | "rejected" | "pending"
   * Endpoint: /useless/public/api/waste/{id}/status
   */
  updateWasteStatus: async (wasteId: number, status: "approved" | "rejected" | "pending") => {
    const loadingToast = toast.loading(`Updating to ${status}...`);

    try {
      // Constructs: /useless/public/api/waste/{wasteId}/status
      const url = `${ENDPOINTS.WASTE.UPDATE_STATUS}/${wasteId}/status`;

      const res = await apiClient.post(url, {
        status: status
      });

      if (res.data?.status || res.status === 200) {
        toast.success(`Record successfully ${status}`, { id: loadingToast });
        return res.data;
      } else {
        throw new Error(res.data?.message || "Failed to update status");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || `Failed to update status to ${status}`;
      toast.error(errorMsg, { id: loadingToast });
      throw error;
    }
  }


};

