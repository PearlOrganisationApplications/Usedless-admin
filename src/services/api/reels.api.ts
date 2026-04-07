import axiosInstance from './axios';

export interface Reel {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isTrending: boolean;
  views: number;
  likes: number;
  createdAt: string;
}

export const reelsApi = {
  getAll: async (): Promise<Reel[]> => {
    // Returning mock data for now
    return [
      { 
        id: 'r-1', title: 'Calculus Basics', teacherId: 't-1', teacherName: 'Dr. Amit Trivedi',
        videoUrl: '#', thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=200',
        category: 'Mathematics', status: 'PENDING', isTrending: false,
        views: 0, likes: 0, createdAt: new Date().toISOString()
      },
      { 
        id: 'r-2', title: 'English Pronunciation', teacherId: 't-2', teacherName: 'Sneh Lata',
        videoUrl: '#', thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200',
        category: 'English', status: 'APPROVED', isTrending: true,
        views: 1240, likes: 450, createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  },
  approve: async (id: string) => {
    console.log('Mock Approve Reel', id);
    return { success: true };
  },
  reject: async (id: string, reason: string) => {
    console.log('Mock Reject Reel', id, reason);
    return { success: true };
  },
  toggleTrending: async (id: string, isTrending: boolean) => {
    console.log('Mock Toggle Trending', id, isTrending);
    return { success: true };
  },
  delete: async (id: string) => {
    console.log('Mock Delete Reel', id);
    return { success: true };
  }
};
