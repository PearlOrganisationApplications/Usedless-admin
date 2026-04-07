import api from './axios';

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
  lastActive: string;
  totalStudyTime: string;
}

export const studentApi = {
  getAll: async () => {
    // In a real app: return (await api.get('/students')).data;
    return [
      { id: '1', name: 'Aarav Sharma', email: 'aarav@example.com', class: '10th', status: 'ACTIVE', lastActive: '2 mins ago', totalStudyTime: '120 hrs' },
      { id: '2', name: 'Ishani Patel', email: 'ishani@example.com', class: '12th', status: 'ACTIVE', lastActive: '5 mins ago', totalStudyTime: '85 hrs' },
      { id: '3', name: 'Rohan Gupta', email: 'rohan@example.com', class: '9th', status: 'SUSPENDED', lastActive: '1 day ago', totalStudyTime: '45 hrs' },
      { id: '4', name: 'Ananya Iyer', email: 'ananya@example.com', class: '11th', status: 'BLOCKED', lastActive: '3 days ago', totalStudyTime: '150 hrs' },
      { id: '5', name: 'Kabir Verma', email: 'kabir@example.com', class: '10th', status: 'ACTIVE', lastActive: '10 mins ago', totalStudyTime: '200 hrs' },
    ] as Student[];
  },

  updateStatus: async (id: string, status: Student['status']) => {
    return api.patch(`/students/${id}/status`, { status });
  }
};
