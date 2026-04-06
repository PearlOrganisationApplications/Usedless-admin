// api/controller/waste_service.ts
import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";

export const wasteService = {
  // Logic for the Bulk API we just discussed
  storeBulkWaste: async (payload: any) => {
    try {
      const response = await apiClient.post(ENDPOINTS.WASTE.BULK, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logic to fetch all waste
  getAllWaste: async (date: string) => {
    try {
      const response = await apiClient.get(ENDPOINTS.WASTE.ALL, { params: { date } });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};