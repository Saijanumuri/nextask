import { create } from 'zustand';
import type { Task } from '../db/db';
import { getAllTasks, addTask, updateTask, deleteTask, completeTask, uncompleteTask } from '../db/queries';

interface TaskStore {
  tasks: Task[];
  filter: 'all' | 'today' | 'upcoming' | 'completed' | 'priority';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'tag';
  isLoading: boolean;
  
  loadTasks: (userId: string) => Promise<void>;
  addNewTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateExistingTask: (id: number, updates: Partial<Task>) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  toggleTaskComplete: (id: number, isCompleted: boolean, userId: string) => Promise<void>;
  setFilter: (filter: TaskStore['filter']) => void;
  setSortBy: (sortBy: TaskStore['sortBy']) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filter: 'all',
  sortBy: 'dueDate',
  isLoading: false,
  
  loadTasks: async (userId: string) => {
    set({ isLoading: true });
    const tasks = await getAllTasks(userId);
    set({ tasks, isLoading: false });
  },
  
  addNewTask: async (task) => {
    await addTask(task);
    if (task.userId) {
      await get().loadTasks(task.userId);
    }
  },
  
  updateExistingTask: async (id, updates) => {
    await updateTask(id, updates);
    const currentTasks = get().tasks;
    const task = currentTasks.find(t => t.id === id);
    if (task?.userId) {
      await get().loadTasks(task.userId);
    }
  },
  
  removeTask: async (id) => {
    const currentTasks = get().tasks;
    const task = currentTasks.find(t => t.id === id);
    await deleteTask(id);
    if (task?.userId) {
      await get().loadTasks(task.userId);
    }
  },
  
  toggleTaskComplete: async (id, isCompleted, userId) => {
    if (isCompleted) {
      await completeTask(id, userId);
    } else {
      await uncompleteTask(id);
    }
    await get().loadTasks(userId);
  },
  
  setFilter: (filter) => set({ filter }),
  setSortBy: (sortBy) => set({ sortBy }),
}));
