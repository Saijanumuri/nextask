import { create } from 'zustand';
import { getCurrentStreak, getLongestStreak } from '../db/queries';

interface StreakStore {
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
  
  loadStreaks: (userId: string) => Promise<void>;
}

export const useStreakStore = create<StreakStore>((set) => ({
  currentStreak: 0,
  longestStreak: 0,
  isLoading: false,
  
  loadStreaks: async (userId: string) => {
    set({ isLoading: true });
    const [current, longest] = await Promise.all([
      getCurrentStreak(userId),
      getLongestStreak(userId),
    ]);
    set({ currentStreak: current, longestStreak: longest, isLoading: false });
  },
}));
