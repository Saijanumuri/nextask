import { db, type Task, type FocusSession, type StopwatchSession } from './db';
import { format, parseISO } from 'date-fns';

// Task queries
export const getAllTasks = async (userId: string): Promise<Task[]> => {
  return await db.tasks.where('userId').equals(userId).toArray();
};

export const getTodayTasks = async (userId: string): Promise<Task[]> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return await db.tasks
    .where('userId').equals(userId)
    .filter(task => !!task.dueDate?.startsWith(today))
    .toArray();
};

export const getTasksByDate = async (userId: string, date: string): Promise<Task[]> => {
  return await db.tasks
    .where('userId').equals(userId)
    .filter(task => !!task.dueDate?.startsWith(date))
    .toArray();
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<number> => {
  return await db.tasks.add(task);
};

export const updateTask = async (id: number, updates: Partial<Task>): Promise<number> => {
  return await db.tasks.update(id, updates);
};

export const deleteTask = async (id: number): Promise<void> => {
  await db.tasks.delete(id);
};

export const completeTask = async (id: number, userId: string): Promise<void> => {
  await db.tasks.update(id, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  });
  
  // Update streak
  const today = format(new Date(), 'yyyy-MM-dd');
  const existingStreak = await db.streaks
    .where('[userId+date]')
    .equals([userId, today])
    .first();
  
  if (existingStreak) {
    await db.streaks.update(existingStreak.id!, {
      tasksCompleted: existingStreak.tasksCompleted + 1,
    });
  } else {
    await db.streaks.add({
      userId,
      date: today,
      tasksCompleted: 1,
    });
  }
};

export const uncompleteTask = async (id: number): Promise<void> => {
  await db.tasks.update(id, {
    status: 'pending',
    completedAt: undefined,
  });
};

// Focus session queries
export const addFocusSession = async (session: Omit<FocusSession, 'id'>): Promise<number> => {
  return await db.focusSessions.add(session);
};

export const getTodayFocusTime = async (userId: string): Promise<number> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const sessions = await db.focusSessions
    .where('userId').equals(userId)
    .filter(session => session.startTime.startsWith(today))
    .toArray();
  
  return sessions.reduce((total, session) => total + session.duration, 0);
};

export const getTodaySessionCount = async (userId: string): Promise<number> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return await db.focusSessions
    .where('userId').equals(userId)
    .filter(session => session.startTime.startsWith(today))
    .count();
};

// Streak queries
export const getCurrentStreak = async (userId: string): Promise<number> => {
  const allStreaks = await db.streaks
    .where('userId').equals(userId)
    .reverse()
    .sortBy('date');
  
  if (allStreaks.length === 0) return 0;
  
  let streak = 0;
  const today = format(new Date(), 'yyyy-MM-dd');
  let currentDate = new Date();
  
  for (const record of allStreaks) {
    const recordDate = format(parseISO(record.date), 'yyyy-MM-dd');
    const expectedDate = format(currentDate, 'yyyy-MM-dd');
    
    if (recordDate === expectedDate && record.tasksCompleted > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (recordDate === today && record.tasksCompleted === 0) {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

export const getLongestStreak = async (userId: string): Promise<number> => {
  const allStreaks = await db.streaks
    .where('userId').equals(userId)
    .sortBy('date');
  
  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;
  
  for (const record of allStreaks) {
    if (record.tasksCompleted === 0) {
      currentStreak = 0;
      lastDate = null;
      continue;
    }
    
    const recordDate = parseISO(record.date);
    
    if (lastDate === null) {
      currentStreak = 1;
    } else {
      const dayDiff = Math.floor((recordDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }
    
    maxStreak = Math.max(maxStreak, currentStreak);
    lastDate = recordDate;
  }
  
  return maxStreak;
};

// Stopwatch queries
export const saveStopwatchSession = async (session: Omit<StopwatchSession, 'id'>): Promise<number> => {
  return await db.stopwatchSessions.add(session);
};

export const getAllStopwatchSessions = async (userId: string): Promise<StopwatchSession[]> => {
  return await db.stopwatchSessions
    .where('userId').equals(userId)
    .reverse()
    .sortBy('savedAt');
};

export const deleteStopwatchSession = async (id: number): Promise<void> => {
  await db.stopwatchSessions.delete(id);
};

// Stats queries
export const getTodayCompletedCount = async (userId: string): Promise<number> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return await db.tasks
    .where('userId').equals(userId)
    .filter(task => !!task.completedAt?.startsWith(today))
    .count();
};
