import { create } from 'zustand';

type TimerState = 'idle' | 'running' | 'paused' | 'break' | 'done';

interface TimerStore {
  state: TimerState;
  workDuration: number; // minutes
  breakDuration: number; // minutes
  timeRemaining: number; // seconds
  selectedTaskId: number | null;
  sessionCount: number;
  
  setState: (state: TimerState) => void;
  setWorkDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
  setTimeRemaining: (time: number) => void;
  setSelectedTaskId: (id: number | null) => void;
  incrementSessionCount: () => void;
  resetTimer: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  state: 'idle',
  workDuration: 25,
  breakDuration: 5,
  timeRemaining: 25 * 60,
  selectedTaskId: null,
  sessionCount: 0,
  
  setState: (state) => set({ state }),
  
  setWorkDuration: (duration) => set({ 
    workDuration: duration,
    timeRemaining: get().state === 'idle' ? duration * 60 : get().timeRemaining
  }),
  
  setBreakDuration: (duration) => set({ breakDuration: duration }),
  
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  
  incrementSessionCount: () => set({ sessionCount: get().sessionCount + 1 }),
  
  resetTimer: () => set({ 
    state: 'idle',
    timeRemaining: get().workDuration * 60,
  }),
  
  tick: () => {
    const { timeRemaining, state } = get();
    if (state === 'running' && timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },
}));
