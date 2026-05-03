import Dexie, { type Table } from 'dexie';

export interface Task {
  id?: number;
  userId: string;
  title: string;
  description?: string;
  dueDate?: string;       // ISO string
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'completed';
  tag?: string;
  createdAt: string;
  completedAt?: string;
}

export interface FocusSession {
  id?: number;
  userId: string;
  taskId?: number;
  startTime: string;
  endTime?: string;
  duration: number;       // seconds
}

export interface StreakRecord {
  id?: number;
  userId: string;
  date: string;           // YYYY-MM-DD
  tasksCompleted: number;
}

export interface StopwatchSession {
  id?: number;
  userId: string;
  label: string;
  elapsed: number;        // milliseconds
  laps: number[];
  savedAt: string;
}

export interface User {
  id?: number;
  passkey: string;        // Unique 6-digit passkey
  name: string;
  dob: string;            // Date of birth
  createdAt: string;
  lastLogin: string;
}

export class NexTaskDB extends Dexie {
  tasks!: Table<Task>;
  focusSessions!: Table<FocusSession>;
  streaks!: Table<StreakRecord>;
  stopwatchSessions!: Table<StopwatchSession>;
  users!: Table<User>;

  constructor() {
    super('NexTaskDB');
    this.version(2).stores({
      tasks: '++id, userId, title, dueDate, priority, status, tag, createdAt',
      focusSessions: '++id, userId, taskId, startTime',
      streaks: '++id, userId, date',
      stopwatchSessions: '++id, userId, savedAt',
      users: '++id, passkey, name, dob',
    });
  }
}

export const db = new NexTaskDB();
