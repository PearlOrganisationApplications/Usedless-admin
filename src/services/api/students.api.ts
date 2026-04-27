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
  getAll: async (): Promise<Student[]> => {
    const res = await api.get('/students');

    return res.data.map((item: any) => ({
      id: item.studentId, // 🔥 important
      name: item.name || '—',
      email: item.email || '—',

      // ❗ You don't have class in API
      class: 'N/A',

      // ❗ No status in API → derive or default
      status: 'ACTIVE',

      // Use createdAt as lastActive
      lastActive: item.createdAt
        ? new Date(item.createdAt).toLocaleString()
        : '—',

      // No study time in API
      totalStudyTime: '0 hrs',
    }));
  },

  updateStatus: async (id: string, status: Student['status']) => {
    return api.patch(`/students/${id}/status`, { status });
  },
};