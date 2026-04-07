import axiosInstance from './axios';

export interface LiveClass {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  startTime: string;
  duration: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  price: number;
  studentsCount: number;
  chatEnabled: boolean;
}

export const liveClassesApi = {
  getAll: async (): Promise<LiveClass[]> => {
    // Returning mock data for now
    return [
      { 
        id: 'lc-1', title: 'Advanced Calculus Workshop', teacherId: 't-1', teacherName: 'Dr. Amit Trivedi',
        startTime: '2026-04-01T10:00:00Z', duration: '60 min', status: 'UPCOMING',
        price: 499, studentsCount: 150, chatEnabled: true 
      },
      { 
        id: 'lc-2', title: 'Modern English Poetry', teacherId: 't-2', teacherName: 'Sneh Lata',
        startTime: '2026-03-30T15:00:00Z', duration: '45 min', status: 'LIVE',
        price: 299, studentsCount: 85, chatEnabled: true 
      }
    ];
  },
  create: async (data: any) => {
    console.log('Mock Create Live Class', data);
    return { id: Math.random().toString(), ...data };
  },
  delete: async (id: string) => {
    console.log('Mock Delete Live Class', id);
    return { success: true };
  },
  updateSettings: async (id: string, settings: any) => {
    console.log('Mock Update Settings', id, settings);
    return { success: true };
  }
};
