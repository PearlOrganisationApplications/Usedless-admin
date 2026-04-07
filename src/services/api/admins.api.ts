import api from './axios';

export interface Admin {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role?: string | any;
  role_?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const adminApi = {
  /**
   * Login an admin user
   */
  login: async (email: string, password: string) => {
    return api.post('/admins/login', { email, password });
  },

  /**
   * Create a new admin
   */
  create: async (adminData: Partial<Admin>) => {
    return api.post('/admins/create', adminData);
  },

  /**
   * Get all admins
   */
  getAll: async () => {
    return api.get('/admins');
  }
};
