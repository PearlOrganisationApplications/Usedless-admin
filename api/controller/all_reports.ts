import apiClient from "../apiClient"; 
import toast from "react-hot-toast";
import { ENDPOINTS } from "../endpoints";

/**
 * Handle Location and Waste Type Management (Places/Admin Logic)
 */
export const handle_location = {
  getAdminData: async (isLocation: boolean) => {
    try {
      const endpoint = isLocation ? ENDPOINTS.LOCATION.ADMIN : ENDPOINTS.WASTE.ADMIN_TYPES;
      const res = await apiClient.get(endpoint);
      return res?.data?.data || [];
    } catch (error) {
      console.error("Error fetching admin data:", error);
      return [];
    }
  },

  getClientData: async (isLocation: boolean) => {
    try {
      const endpoint = isLocation ? ENDPOINTS.LOCATION.CLIENT : ENDPOINTS.WASTE.CLIENT_TYPES;
      const res = await apiClient.get(endpoint);
      const rawData = res?.data?.data || [];

      if (isLocation) {
        return rawData.map((item: any) => ({
          ...item,
          name: item.name || item.location || "Unknown" 
        }));
      }
      return rawData;
    } catch (error) {
      console.error("Error fetching client data:", error);
      return [];
    }
  },

  add_Location: async (payload: any) => {
    const loadingToast = toast.loading(payload.selectedId ? "Updating..." : "Saving...");
    try {
      let url = payload.active ? ENDPOINTS.LOCATION.ADMIN : ENDPOINTS.WASTE.ADMIN_TYPES;
      if (payload.selectedId) {
        url = payload.active 
          ? `${ENDPOINTS.LOCATION.ADMIN}/${payload.selectedId}` 
          : `${ENDPOINTS.WASTE.UPDATE_TYPE_BY_CAT}/${payload.selectedId}`;
      }
      const res = await apiClient.post(url, {
        name: payload.name,
        areas: payload.areas,
        category_id: payload.category_id
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("Saved Successfully", { id: loadingToast });
        return res.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save data", { id: loadingToast });
      throw error;
    }
  },

  deleteLocation: async (id: string | number, isLocation: boolean) => {
    const loadingToast = toast.loading("Deleting...");
    try {
      const endpoint = isLocation ? ENDPOINTS.LOCATION.ADMIN : ENDPOINTS.WASTE.ADMIN_TYPES;
      await apiClient.delete(`${endpoint}/${id}`);
      toast.success("Deleted Successfully", { id: loadingToast });
      return true;
    } catch (error) {
      toast.error("Delete failed", { id: loadingToast });
      return false;
    }
  },

  getCategories: async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.CATEGORY.GET_ALL);
      return res.data?.data || [];
    } catch (error) { return []; }
  },

  add_Category: async (name: string) => {
    const loadingToast = toast.loading("Adding category...");
    try {
      const res = await apiClient.post(ENDPOINTS.CATEGORY.ADD, { name });
      if (res.data?.status === "success" || res.status === 200) {
        toast.success("Category Added Successfully", { id: loadingToast });
        return res.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add category", { id: loadingToast });
      throw error;
    }
  },

  update_Category: async (id: number | string, name: string) => {
    const loadingToast = toast.loading("Updating category...");
    try {
      const res = await apiClient.post(`${ENDPOINTS.CATEGORY.UPDATE}/${id}`, { name });
      if (res.status === 200 || res.status === 201) {
        toast.success("Category Updated Successfully", { id: loadingToast });
        return res.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update category", { id: loadingToast });
      throw error;
    }
  },

  delete_Category: async (id: number) => {
    const loadingToast = toast.loading("Deleting category...");
    try {
      const res = await apiClient.delete(`${ENDPOINTS.CATEGORY.DELETE}/${id}`);
      toast.success("Category Deleted Successfully", { id: loadingToast });
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category", { id: loadingToast });
      throw error;
    }
  }
};

/**
 * Handle Individual Waste Reports (Table/Logs Logic)
 * Added this to resolve the 'exported member' error
 */
export const handle_waste_reports = {
  get_waste_reports: async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.WASTE.ALL);
      return res?.data?.data || [];
    } catch (error) {
      console.error("GET Waste Reports Error:", error);
      return [];
    }
  },

  get_waste_reports_details: async (id: string | number, date?: string) => {
    try {
      const res = await apiClient.get(`${ENDPOINTS.WASTE.ALL}/${id}`, { params: { date } });
      return res.data?.data || null;
    } catch (error: any) {
      return null;
    }
  },

  delete_waste: async (id: number) => {
    const loadingToast = toast.loading("Deleting record...");
    try {
      const res = await apiClient.delete(`${ENDPOINTS.WASTE.UPDATE_STATUS}/${id}`);
      if (res.status === 200 || res.status === 201) {
        toast.success("Deleted Successfully", { id: loadingToast });
        return true;
      }
      throw new Error("Delete failed");
    } catch (error: any) {
      toast.error("Failed to delete", { id: loadingToast });
      return false;
    }
  },

  edit_wastes: async (editData: any, location_id: number) => {
    const loadingToast = toast.loading("Saving changes...");
    try {
      // URL: .../api/update-location-status/{location_id}/{waste_item_id}
      const url = `/useless/public/api/update-location-status/${location_id}/${editData.id}`;
      
      const res = await apiClient.post(url, {
        status: editData.status,
        quantity: editData.quantity,
        unit: editData.unit
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Saved Successfully", { id: loadingToast });
        return res;
      }
      throw new Error("Update failed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update", { id: loadingToast });
      throw error;
    }
  }
};