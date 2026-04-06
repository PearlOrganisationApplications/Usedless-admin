// api/controller/dashboardService.ts
import apiClient from "../apiClient";
import { ENDPOINTS } from "../endpoints";

export const dashboardService = {
  getClients: async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.CLIENT.GET_ALL);
      return res.data?.data || [];
    } catch (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
  },

  getLocations: async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.LOCATION.ADMIN);
      return res.data?.locations || res.data?.data || [];
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  },

  getLocationAnalytics: async (locationId: string) => {
    try {
      const res = await apiClient.get(ENDPOINTS.LOCATION.DETAILS(locationId));
      const data = res.data;
     
      if (data.status !== "success") throw new Error("API Error");

      const wasteBreakdown = data.summary?.waste_types || {};
      const allWaste = Object.keys(wasteBreakdown).map((key) => ({
        name: key.replace(/_/g, " "),
        value: parseFloat(wasteBreakdown[key] || 0),
      })).sort((a, b) => b.value - a.value);

      let dry = 0, wet = 0, reject = 0;
      allWaste.forEach((item) => {
        const name = item.name.toLowerCase();
        if (name.includes("wet")) wet += item.value;
        else if (name.includes("mixed") || name.includes("reject")) reject += item.value;
        else dry += item.value;
      });

      const eco = data.wastes
  .filter((item: any) => item.status === "approved")
  .reduce(
    (acc: any, curr: any) => ({
      landfill: acc.landfill + Number(curr.landfill_saved || 0),
      trees: acc.trees + Number(curr.trees_saved || 0),
      mtco2: acc.mtco2 + Number(curr.mtco2_reduced || 0),
    }),
    { landfill: 0, trees: 0, mtco2: 0 }
  );
      console.log("Location Analytics ", eco);

      return {
        isClient: false,
        pieData: [
          { name: "Dry Waste", value: dry },
          { name: "Wet Waste", value: wet },
          { name: "Reject/Mixed", value: reject },
        ],
        allWasteTypes: allWaste,
        dryWasteOnly: allWaste.filter((w) => !w.name.toLowerCase().includes("wet")),
        ecoSummary: eco,
        locationInfo: data.location,
      };
    } catch (error) {
      console.error("Location Analytics Service Error:", error);
      throw error;
    }
  },

  getTempLoginLinks: async () => {
    try {
      const res = await apiClient.post(ENDPOINTS.CLIENT.TEMP_LOGIN);
      return res.data?.links || [];
    } catch (error) {
      console.error("Error fetching temp login links:", error);
      return [];
    }
  },

  getDashboardData: async (filter: string, roleParam?: string, clientId?: string) => {
    try {
      const storageRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;
      const activeRole = (roleParam || storageRole || "").toLowerCase();
      const isClient = activeRole === "collector" || activeRole === "client";
      const endpoint = isClient ? ENDPOINTS.DASHBOARD.CLIENT : ENDPOINTS.DASHBOARD.ADMIN;

      const params: any = {};
      if (filter !== "all") params.filter = filter;
      if (clientId && clientId !== "all") params.client_id = clientId;

      const res = await apiClient.get(endpoint, { params });
      const apiData = res.data?.data || res.data || {};
      const wasteTypes = apiData.waste_types || [];
      const approvedCalc = apiData.calculations?.approved || {};

      let dryTotal = 0, wetTotal = 0, rejectTotal = 0;

      const processedWaste = wasteTypes.map((item: any) => {
        const qty = parseFloat(item.quantity || 0);
        const type = (item.waste_type || "").toLowerCase();
        const cat = (item.category_name || "").toLowerCase();

        if (type.includes("reject")) rejectTotal += qty;
        else if (cat.includes("wet") || type.includes("wet")) wetTotal += qty;
        else dryTotal += qty;

        return {
          name: (item.waste_type || "").replace(/_/g, " "),
          value: qty,
          category: cat,
        };
      });

      return {
        isClient,
        pieData: [
          { name: "Dry Waste", value: dryTotal },
          { name: "Wet Waste", value: wetTotal },
          { name: "Reject Waste", value: rejectTotal },
        ],
        dryWasteOnly: processedWaste
          .filter((w: any) => w.category.includes("dry") && !w.name.toLowerCase().includes("reject"))
          .sort((a: any, b: any) => b.value - a.value),
        allWasteTypes: [...processedWaste].sort((a: any, b: any) => b.value - a.value),
        ecoSummary: {
          landfill: approvedCalc.landfill_saved || 0,
          trees: approvedCalc.trees_saved || 0,
          mtco2: approvedCalc.mtco2_reduced || 0,
        },
      };
    } catch (error) {
      console.error("Dashboard Service Error:", error);
      throw error;
    }
  },

  getMissedPunches: async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.LOCATION.MISSED_PUNCHES);
      return res.data;
    } catch (error) {
      console.error("Error fetching missed punches:", error);
      return null;
    }
  },
};