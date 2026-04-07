import api from './axios';

export interface Document {
  id: string;
  type: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  url: string;
}

export interface ScheduleSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface TeacherAnalytics {
  rating: number;
  sessionSuccessRate: string;
  responseTime: string;
  complaintCount: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  expertise: string[];
  bio: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';
  isVerified: boolean;
  rating: number;
  sessionsCount: number;
  isOnline: boolean;
  autoAssign: boolean;
  experienceYears: number;
  isExperienceVerified: boolean;
  onboardingStep: 'REGISTRATION' | 'DOCUMENTS' | 'DEMO_SESSION' | 'APPROVAL';
  documents: Document[];
  analytics: TeacherAnalytics;
}

export const teacherApi = {

  getAll: async (): Promise<Teacher[]> => {
  const res = await api.get('/teachers');
    return res.data.map((t: any) => ({
    id: t._id,
    name: t.userId?.email?.split('@')[0] || 'No Name',
    email: t.userId?.email || '',
    subject: t.ExperienceDetails?.subjects?.[0] || 'N/A',
    expertise: t.ExperienceDetails?.subjects || [],
    bio: '',
    status: t.isVerified ? 'ACTIVE' : 'PENDING',
    isVerified: t.isVerified,
    userId: t.userId,
    rating: 0,
    sessionsCount: 0,
    isOnline: false,
    autoAssign: false,
    experienceYears: 0,
    isExperienceVerified: false,
    onboardingStep: 'REGISTRATION',
    documents: [],
    analytics: {
      rating: 0,
      sessionSuccessRate: '0%',
      responseTime: '0',
      complaintCount: 0
    }
  }));
},

  getById: async (id: string) => {
    const list = await teacherApi.getAll();
    return list.find(t => t.id === id);
  },


  approve: async (id: string) => api.post(`/teachers/${id}/approve`),
  reject: async (id: string) => api.post(`/teachers/${id}/reject`),
  suspend: async (id: string) => api.post(`/teachers/${id}/suspend`),
  ban: async (id: string) => api.post(`/teachers/${id}/ban`),
  remove: async (id: string) => api.delete(`/teachers/${id}`),
  updateStatus: async (id: string, status: Teacher['status']) => api.patch(`/teachers/${id}/status`, { status }),
  updateOnboardingStep: async (id: string, step: Teacher['onboardingStep']) => api.patch(`/teachers/${id}/onboarding-step`, { step }),
  verifyDocument: async (id: string, docId: string, status: 'VERIFIED' | 'REJECTED') => api.patch(`/teachers/${id}/documents/${docId}`, { status }),
  updateAvailability: async (id: string, isOnline: boolean) => api.patch(`/teachers/${id}/availability`, { isOnline }),
  toggleAutoAssign: async (id: string, autoAssign: boolean) => api.patch(`/teachers/${id}/auto-assign`, { autoAssign }),
  updateProfile: async (id: string, data: Partial<Teacher>) => api.patch(`/teachers/${id}/profile`, data),
  getSchedule: async (id: string) => [
    { id: 's1', day: 'Monday', startTime: '10:00', endTime: '12:00', isBooked: false },
    { id: 's2', day: 'Monday', startTime: '14:00', endTime: '16:00', isBooked: true },
  ] as ScheduleSlot[],
};
