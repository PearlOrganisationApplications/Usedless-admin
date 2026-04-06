import apiClient from "../apiClient";
import toast from "react-hot-toast";
import { ENDPOINTS } from "../endpoints";

export const handle_client = {
  /**
   * Generates a link AND performs the background login to set credentials
   */
  generateTempLoginLink: async (clientId: number) => {
    const loadingToast = toast.loading("Switching identity...");
    try {
      const res = await apiClient.post(ENDPOINTS.CLIENT.TEMP_LOGIN, {
        client_id: clientId,
      });

      if (res.data?.status && res.data?.links?.length > 0) {
        const targetLink = res.data.links.find((l: any) => l.client_id === clientId) || res.data.links[0];
        const loginUrl = targetLink.login_url;

        const authRes = await apiClient.get(loginUrl);

        if (authRes.data?.status) {
          const newToken =
            authRes.data.token ||
            authRes.data.access_token ||
            authRes.data.data?.token ||
            authRes.data.data?.access_token;

          const userData = authRes.data.user || authRes.data.data?.user;

          if (!newToken) throw new Error("Token missing in switch response");

          if (typeof window !== "undefined") {
            localStorage.clear();
            localStorage.setItem("access_token", newToken);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("role", "collector");

            if (userData?.first_name) {
              localStorage.setItem("client_name", userData.first_name);
            }
          }

          toast.success("Logged in as " + (userData?.first_name || "Client"), { id: loadingToast });

          setTimeout(() => {
            window.location.href = "/";
          }, 800);

          return true;
        }
      }
      toast.error("No valid login link found", { id: loadingToast });
      return false;
    } catch (error: any) {
      console.error("IDENTITY SWITCH ERROR:", error);
      const errorMsg = error.response?.data?.message || "Failed to login as client";
      toast.error(errorMsg, { id: loadingToast });
      return false;
    }
  },

  /**
   * Create a new client record
   */
  createClient: async (formData: any) => {
    const loadingToast = toast.loading("Onboarding client...");
    try {
      const locationArray = Array.isArray(formData.location_ids)
        ? formData.location_ids.map((id: any) => Number(id))
        : [];

      if (locationArray.length === 0) {
        toast.error("Please select at least one Location", { id: loadingToast });
        return null;
      }

      const res = await apiClient.post(ENDPOINTS.CLIENT.CREATE, {
        ...formData,
        location_ids: locationArray,
      });

      if (res.data?.status || res.status === 200 || res.status === 201) {
        toast.success("Client Registered Successfully", { id: loadingToast });
        return res.data;
      }
      throw new Error(res.data?.message || "Registration failed");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to create client";
      toast.error(msg, { id: loadingToast });
      return null;
    }
  },

  /**
   * Enable/Disable client account
   */
  toggleClientStatus: async (clientId: number, newStatus: number) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      const res = await apiClient.post(ENDPOINTS.CLIENT.STATUS, {
        client_id: clientId,
        status: newStatus,
      });

      if (res.data?.status || res.status === 200) {
        toast.success(newStatus === 1 ? "Client Activated" : "Client Deactivated", { id: loadingToast });
        return res.data;
      }
      throw new Error("Update failed");
    } catch (error: any) {
      toast.error("Failed to update status", { id: loadingToast });
      return null;
    }
  },

  /**
   * Update locations assigned to a client
   */
  updateClientLocations: async (clientId: number, locationIds: number[]) => {
    const loadingToast = toast.loading("Updating locations...");
    try {
      const res = await apiClient.post(ENDPOINTS.CLIENT.UPDATE, {
        client_id: clientId,
        location_ids: locationIds,
      });

      if (res.data?.status || res.status === 200) {
        toast.success("Locations synced successfully", { id: loadingToast });
        return res.data;
      }
      throw new Error("Update failed");
    } catch (error: any) {
      toast.error("Failed to update locations", { id: loadingToast });
      return null;
    }
  },

  getCollectorUsers: async (id: number) => {
    try {
      const res = await apiClient.get(ENDPOINTS.CLIENT.GET_USERS(id));
      return res.data?.data || [];
    } catch (e) { return []; }
  },

  getCollectorWastes: async (id: number) => {
    try {
      const res = await apiClient.get(ENDPOINTS.CLIENT.GET_WASTES(id));
      return res.data?.data || [];
    } catch (e) { return []; }
  },

  getUserWasteHistory: async (userId: number) => {
    try {
      const res = await apiClient.get(ENDPOINTS.USER.GET_WASTE_HISTORY(userId));
      return res.data?.data || [];
    } catch (e) { return []; }
  }
};