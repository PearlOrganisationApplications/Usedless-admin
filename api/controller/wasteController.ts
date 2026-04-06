// api/controller/wasteController.ts
import apiClient from "../apiClient";
import toast from "react-hot-toast";
import { ENDPOINTS } from "../endpoints";

export const manage_waste = {
    // ... previous methods (getAllWaste, getLocationSummary, storeManualWaste, etc.)

    getWasteTypes: async () => {
        try {
            const res = await apiClient.get(ENDPOINTS.WASTE.ADMIN_TYPES);
            return res.data?.data || [];
        } catch (error) {
            console.error("Error fetching waste types:", error);
            return [];
        }
    },

    getLocationAreas: async (locationId: number) => {
        try {
            const res = await apiClient.get(ENDPOINTS.WASTE.LOCATION_AREAS(locationId));
            // Postman shows: res.data.data.areas is the array of strings
            return res.data?.data?.areas || [];
        } catch (error) {
            console.error("Error fetching areas:", error);
            return [];
        }
    },

    getAllWaste: async (date: string) => {
        try {
            const res = await apiClient.get(ENDPOINTS.WASTE.ALL, { params: { date } });
            return res.data?.data || [];
        } catch (error) { return []; }
    },

    getLocationSummary: async (date: string) => {
        try {
            const res = await apiClient.get(ENDPOINTS.WASTE.UNIQUE_LOCATIONS, { params: { date } });
            return res.data?.data || [];
        } catch (error) { return []; }
    },

    storeManualWaste: async (payload: any) => {
        const loadingToast = toast.loading("Saving records...");
        try {
            const finalPayload = {
                ...payload,
                waste_entries: payload.waste_entries.map((e: any) => ({ ...e, status: "pending" }))
            };
            const res = await apiClient.post(ENDPOINTS.WASTE.BULK, finalPayload);
            if (res.data?.status) {
                toast.success("Records saved as Pending", { id: loadingToast });
                return true;
            }
            throw new Error(res.data?.message || "Failed to save");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save records", { id: loadingToast });
            return false;
        }
    },

    storeBulkWaste: async (payload: any) => {
        const loadingToast = toast.loading("Uploading bulk data...");
        try {
            const res = await apiClient.post("/useless/public/api/admin/storeBulkWaste", payload);
            if (res.data?.status) {
                toast.success("Bulk data stored as Pending", { id: loadingToast });
                return true;
            }
            throw new Error(res.data?.message || "Bulk upload failed");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Upload failed", { id: loadingToast });
            return false;
        }
    },

    updateWasteRecord: async (wasteId: number, updateData: any) => {
        const loadingToast = toast.loading("Updating record...");
        try {
            let url = "";
            const status = updateData.status.toLowerCase();
            if (status === "approved") url = ENDPOINTS.WASTE.APPROVE(wasteId);
            else if (status === "rejected") url = ENDPOINTS.WASTE.REJECT(wasteId);
            else if (status === "pending") url = ENDPOINTS.WASTE.PENDING(wasteId);
            else url = ENDPOINTS.WASTE.UPDATE_ADMIN(wasteId);

            const res = await apiClient.post(url, {
                quantity: updateData.quantity,
                unit: updateData.unit,
                status: status,
                area: updateData.area // Include area in update if needed
            });

            if (res.data?.status || res.status === 200) {
                toast.success(`Status updated to ${status}`, { id: loadingToast });
                return true;
            }
            throw new Error(res.data?.message || "Update failed");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Update failed", { id: loadingToast });
            return false;
        }
    }
};