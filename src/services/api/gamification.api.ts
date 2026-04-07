import axiosInstance from './axios';

export interface McqTest {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  scheduledAt: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface SpinReward {
  id: string;
  label: string;
  probability: number; // 0-100
  type: 'POINTS' | 'CASH' | 'BADGE' | 'BETTER_LUCK';
}

export const gamificationApi = {
  // MCQ Methods
  getAllMcqs: async (): Promise<McqTest[]> => {
    return [
      { id: '1', title: 'Mathematics Grade 10', description: 'Algebra and Geometry basics', questionCount: 25, difficulty: 'MEDIUM', scheduledAt: '2026-04-01', status: 'SCHEDULED' },
      { id: '2', title: 'English Literature', description: 'Shakespearean plays and sonnets', questionCount: 15, difficulty: 'EASY', scheduledAt: '2026-03-29', status: 'ACTIVE' },
      { id: '3', title: 'Physics Advanced', description: 'Quantum mechanics and relativity', questionCount: 30, difficulty: 'HARD', scheduledAt: '2026-03-25', status: 'COMPLETED' },
    ];
  },
  createMcq: async (data: any) => {
    console.log('Mock Create MCQ', data);
    return { id: Math.random().toString(), ...data };
  },
  bulkUploadQuestions: async (file: File) => {
    console.log('Mock Bulk Upload', file.name);
    return { success: true };
  },
  updateMcqDifficulty: async (id: string, difficulty: string) => {
    console.log('Mock Update Difficulty', id, difficulty);
    return { success: true };
  },

  // Gamification Methods
  resetLeaderboard: async () => {
    console.log('Mock Reset Leaderboard');
    return { success: true };
  },
  getBadges: async (): Promise<Badge[]> => {
    return [
      { id: 'b1', name: 'Early Bird', description: 'Complete a test before 8 AM', icon: 'Sun', requirement: '1 Early Test' },
      { id: 'b2', name: 'Mastermind', description: 'Score 100% on 5 HARD tests', icon: 'Brain', requirement: '5 Hard 100%' },
      { id: 'b3', name: 'Social Butterfly', description: 'Invite 10 friends to join', icon: 'Users', requirement: '10 Invites' }
    ];
  },
  createBadge: async (data: any) => {
    console.log('Mock Create Badge', data);
    return { id: Math.random().toString(), ...data };
  },
  getSpinRewards: async (): Promise<SpinReward[]> => {
    return [
      { id: 'r1', label: '50 Reward Points', probability: 45, type: 'POINTS' },
      { id: 'r2', label: '100 Reward Points', probability: 25, type: 'POINTS' },
      { id: 'r3', label: 'Exclusive Badge', probability: 10, type: 'BADGE' },
      { id: 'r4', label: 'Better Luck Next Time', probability: 15, type: 'BETTER_LUCK' },
      { id: 'r5', label: '10 Coins', probability: 5, type: 'CASH' }
    ];
  },
  updateSpinRewards: async (rewards: SpinReward[]) => {
    console.log('Mock Update Spin Rewards', rewards);
    return { success: true };
  }
};
