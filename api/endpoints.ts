// api/endpoints.ts
export const BASE_URL = "https://test.pearl-developer.com";
const PREFIX = "/useless/public/api";

export const ENDPOINTS = {
  WASTE: {
    ALL: `${PREFIX}/admin/allwast`,
    STORE: `${PREFIX}/admin/storewaste`,
    BULK: `${PREFIX}/admin/BulkWaste`,
    UNIQUE_LOCATIONS: `${PREFIX}/unique-locations-today`,
    // ADMIN ACTIONS (Using plural 'wastes' pattern from your Postman)
    APPROVE: (id: number) => `${PREFIX}/admin/wastes/${id}/approve`,
    REJECT: (id: number) => `${PREFIX}/admin/wastes/${id}/reject`,
    PENDING: (id: number) => `${PREFIX}/admin/wastes/${id}/pending`,
    UPDATE_ADMIN: (id: number) => `${PREFIX}/admin/wastes/${id}/update`,
    LOCATION_AREAS: (id: number) => `${PREFIX}/admin/location-areas/${id}`,
    UPDATE_STATUS: `${PREFIX}/waste`, // Logic: ${UPDATE_STATUS}/{id}/status (Collector Only)
    ADMIN_TYPES: `${PREFIX}/waste-types`,
    CLIENT_TYPES: `${PREFIX}/client/watetypes`,
    UPDATE_TYPE_BY_CAT: `${PREFIX}/update-waste-type/category`,
  },
  LOCATION: {
    ADMIN: `${PREFIX}/locations`,
    CLIENT: `${PREFIX}/client/locations`,
    MISSED_PUNCHES: `${PREFIX}/not/punch/today/location`,
    DETAILS: (id: string | number) => `${PREFIX}/location-details/${id}`,
  },
  CATEGORY: {
    GET_ALL: `${PREFIX}/waste-category`,
    ADD: `${PREFIX}/add-category`,
    UPDATE: `${PREFIX}/update-category`,
    DELETE: `${PREFIX}/delete-category`,
  },
  AUTH: {
    ADMIN_LOGIN: `${PREFIX}/admin/login`,
    COLLECTOR_LOGIN: `${PREFIX}/collector/login`,
    LOGOUT: `${PREFIX}/collector/logout`,
  },
  CLIENT: {
    CREATE: `${PREFIX}/admin/create/client`,
    GET_ALL: `${PREFIX}/admin/get/client`,
    UPDATE: `${PREFIX}/admin/update/client`,
    STATUS: `${PREFIX}/admin/client/status`,
    TEMP_LOGIN: `${PREFIX}/admin/temp-login-links`,
    GET_USERS: (id: number) => `${PREFIX}/collector/${id}/users`,
    GET_WASTES: (id: number) => `${PREFIX}/collector/${id}/wastes`,
  },
  USER: {
    GET_ALL: `${PREFIX}/get/user`,
    TOGGLE_STATUS: `${PREFIX}/user/toggle-status`,
    GET_WASTE_HISTORY: (id: number) => `${PREFIX}/get/${id}/wastetype`,
  },
  DASHBOARD: {
    ADMIN: `${PREFIX}/admin/dashboard`,
    CLIENT: `${PREFIX}/client/today-report`,
  },
};