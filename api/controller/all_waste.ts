import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";
import toast from "react-hot-toast";

export const handle_waste_reports = {
  /**
   * Fetches the main waste reports list
   */
  get_waste_reports: async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.WASTE.ALL); 
      return res?.data?.data || [];
    } catch (error) {
      console.error("GET Waste Reports Error:", error);
      return [];
    }
  },

  /**
   * Fetches specific details for a waste report
   */
  get_waste_reports_details: async (id: string | number, date?: string) => {
    try {
      const res = await apiClient.get(`${ENDPOINTS.WASTE.ALL}/${id}`, {
        params: { date }
      });
      return res.data?.data || null;
    } catch (error: any) {
      console.error("GET Report Details Error:", error);
      return null;
    }
  },

  /**
   * Deletes a specific waste record
   */
  delete_waste: async (id: number) => {
    const loadingToast = toast.loading("Deleting record...");
    try {
      // Assuming a standard delete endpoint exists in your ENDPOINTS
      const res = await apiClient.delete(`${ENDPOINTS.WASTE.UPDATE_STATUS}/${id}`);
      
      if (res.status === 200 || res.status === 201) {
        toast.success("Deleted Successfully", { id: loadingToast });
        return true;
      }
      throw new Error("Delete failed");
    } catch (error: any) {
      toast.error("Failed to delete record", { id: loadingToast });
      return false;
    }
  },

  /**
   * Updates status (Approve/Reject/Edit)
   */
  update_waste_status: async (id: number, action: 'approve' | 'reject' | string) => {
    const loadingToast = toast.loading(`Processing ${action}...`);
    try {
      // Logic maps to your: /useless/public/api/waste
      const res = await apiClient.post(ENDPOINTS.WASTE.UPDATE_STATUS, {
        id,
        status: action
      });

      if (res.status === 200 || res.status === 201) {
        toast.success(`Record ${action}ed successfully`, { id: loadingToast });
        return true;
      }
      throw new Error("Update failed");
    } catch (error: any) {
      toast.error(`Failed to ${action} record`, { id: loadingToast });
      return false;
    }
  },
};