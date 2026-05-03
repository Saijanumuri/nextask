import { create } from 'zustand';

type Page = 'dashboard' | 'tasks' | 'calendar' | 'focus' | 'stopwatch' | 'stories';

interface AppStore {
  currentPage: Page;
  rageMode: boolean;
  soundEnabled: boolean;
  sidebarCollapsed: boolean;
  
  setCurrentPage: (page: Page) => void;
  setRageMode: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentPage: 'dashboard',
  rageMode: false,
  soundEnabled: false,
  sidebarCollapsed: false,
  
  setCurrentPage: (page) => set({ currentPage: page }),
  setRageMode: (enabled) => set({ rageMode: enabled }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
