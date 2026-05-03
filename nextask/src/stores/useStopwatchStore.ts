import { create } from 'zustand';
import type { StopwatchSession } from '../db/db';
import { saveStopwatchSession, getAllStopwatchSessions, deleteStopwatchSession } from '../db/queries';

interface StopwatchStore {
  isRunning: boolean;
  elapsed: number; // milliseconds
  laps: number[];
  sessions: StopwatchSession[];
  
  start: () => void;
  pause: () => void;
  reset: () => void;
  addLap: () => void;
  saveSession: (label: string, userId: string) => Promise<void>;
  loadSessions: (userId: string) => Promise<void>;
  deleteSession: (id: number, userId: string) => Promise<void>;
  tick: (delta: number) => void;
}

export const useStopwatchStore = create<StopwatchStore>((set, get) => ({
  isRunning: false,
  elapsed: 0,
  laps: [],
  sessions: [],
  
  start: () => set({ isRunning: true }),
  
  pause: () => set({ isRunning: false }),
  
  reset: () => set({ isRunning: false, elapsed: 0, laps: [] }),
  
  addLap: () => {
    const { elapsed, laps } = get();
    set({ laps: [elapsed, ...laps] });
  },
  
  saveSession: async (label, userId) => {
    const { elapsed, laps } = get();
    await saveStopwatchSession({
      userId,
      label,
      elapsed,
      laps,
      savedAt: new Date().toISOString(),
    });
    await get().loadSessions(userId);
    set({ elapsed: 0, laps: [], isRunning: false });
  },
  
  loadSessions: async (userId) => {
    const sessions = await getAllStopwatchSessions(userId);
    set({ sessions });
  },
  
  deleteSession: async (id, userId) => {
    await deleteStopwatchSession(id);
    await get().loadSessions(userId);
  },
  
  tick: (delta) => {
    if (get().isRunning) {
      set({ elapsed: get().elapsed + delta });
    }
  },
}));
