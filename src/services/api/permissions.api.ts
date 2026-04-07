import api from './axios';

export interface PermissionActions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface Permission {
  id?: string;
  name?: string;
  actions?: PermissionActions;
}

export interface Role {
  id?: string;
  name: string;
  permissions: string[];
}

export const permissionApi = {
  /**
   * Create a new role with permissions
   */
  createRole: async (data: { name: string; permissions: string[] }) => {
    return api.post('/permissions/create', data);
  },

  /**
   * Get all permissions
   */
  getAll: async () => {
    return api.get('/permissions');
  },

  /**
   * Update a specific permission's overall actions
   */
  update: async (id: string, actions: PermissionActions) => {
    return api.put(`/permissions/${id}`, { actions });
  },

  /**
   * Update a specific permission for a role
   */
  updateActions: async (roleId: string, permissionId: string, actions: PermissionActions) => {
    return api.put(`/permissions/${roleId}/permissions/${permissionId}`, { actions });
  }
};
