export interface User {
  id: number;
  name: string;
  email: string;
  status: number; // 1 for active, 0 for blocked
  locations?: any[];
  created_at?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}