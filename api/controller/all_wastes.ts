// api/controller/all_wastes.ts
import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";

export const fetchAllWaste = async (page = 1, perPage = 2000) => {
    try {
        const response = await apiClient.get(ENDPOINTS.WASTE.ALL, {
            params: { per_page: perPage, page: page }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateWasteStatus = async (id: number, action: string) => {
    try {
        let url = "";
        const cleanAction = action.toLowerCase();

        if (cleanAction === 'approve' || cleanAction === 'approved') {
            url = ENDPOINTS.WASTE.APPROVE(id);
        } else if (cleanAction === 'reject' || cleanAction === 'rejected') {
            url = ENDPOINTS.WASTE.REJECT(id);
        } else {
            url = ENDPOINTS.WASTE.PENDING(id);
        }

        const response = await apiClient.post(url);
        return response.data;
    } catch (error) {
        console.error("Error in updateWasteStatus:", error);
        throw error;
    }
};