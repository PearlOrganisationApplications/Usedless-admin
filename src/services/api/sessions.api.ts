import api from './axios';

export interface Session {
  id: string;
  studentName: string;
  teacherName: string;
  subject: string;
  status: 'LIVE' | 'COMPLETED' | 'SCHEDULED' | 'CANCELLED';
  startTime: string;
  duration?: string;
  rating?: number;
}

export const sessionsApi = {
  getAll: async () => {
    return [
      { id: '101', studentName: 'Rahul Malhotra', teacherName: 'Dr. Amit Trivedi', subject: 'Mathematics', status: 'LIVE', startTime: '2026-03-30T10:30:00Z', duration: '45m' },
      { id: '102', studentName: 'Priya Singh', teacherName: 'Sneh Lata', subject: 'Physics', status: 'COMPLETED', startTime: '2026-03-30T09:00:00Z', duration: '60m', rating: 4.5 },
      { id: '103', studentName: 'Aryan Khan', teacherName: 'Vikram Singh', subject: 'Chemistry', status: 'SCHEDULED', startTime: '2026-03-31T14:00:00Z' },
      { id: '104', studentName: 'Sanya Mirza', teacherName: 'Priya Verma', subject: 'Biology', status: 'COMPLETED', startTime: '2026-03-29T16:00:00Z', duration: '50m', rating: 5.0 },
      { id: '105', studentName: 'Karan Mehra', teacherName: 'Rajesh Kumar', subject: 'Computer Science', status: 'CANCELLED', startTime: '2026-03-29T10:00:00Z' },
    ] as Session[];
  },
  
  getById: async (id: string) => {
    const list = await sessionsApi.getAll();
    return list.find(s => s.id === id);
  }
};
