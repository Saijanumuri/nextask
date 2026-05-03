import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../stores/useTaskStore';
import { useAuthStore } from '../stores/useAuthStore';
import { TaskCard } from '../components/TaskCard';
import { TaskDrawer } from '../components/TaskDrawer';
import type { Task } from '../db/db';
import { isToday, isFuture, parseISO } from 'date-fns';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

type FilterType = 'all' | 'today' | 'upcoming' | 'completed' | 'priority';
type SortType = 'dueDate' | 'priority' | 'createdAt' | 'tag';

const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export const Tasks = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');
  
  const { tasks, loadTasks, addNewTask, updateExistingTask, removeTask, toggleTaskComplete } = useTaskStore();
  const { currentUser } = useAuthStore();
  
  const userId = currentUser?.passkey || '';
  
  useEffect(() => {
    if (userId) {
      loadTasks(userId);
    }
  }, [userId]);
  
  const handleToggleComplete = async (id: number, isCompleted: boolean) => {
    if (!userId) return;
    await toggleTaskComplete(id, isCompleted, userId);
  };
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDrawerOpen(true);
  };
  
  const handleDelete = async (id: number) => {
    await removeTask(id);
  };
  
  const handleSaveTask = async (task: Omit<Task, 'id'> | Task) => {
    if ('id' in task) {
      await updateExistingTask(task.id!, task);
    } else {
      await addNewTask(task);
    }
    setIsDrawerOpen(false);
    setEditingTask(null);
  };
  
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'today' && task.dueDate) {
      return isToday(parseISO(task.dueDate));
    }
    if (filter === 'upcoming' && task.dueDate) {
      return isFuture(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
    }
    if (filter === 'priority') {
      return task.priority === 'high' || task.priority === 'critical';
    }
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'priority') {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'tag') {
      return (a.tag || '').localeCompare(b.tag || '');
    }
    return 0;
  });
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Tasks</h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsDrawerOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'today', 'upcoming', 'completed', 'priority'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 md:px-4 py-2 rounded-xl font-medium transition-all text-sm md:text-base ${
                filter === f
                  ? 'bg-cyan-400 text-black'
                  : 'border border-white/16 text-white/70 hover:bg-white/8'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="w-full sm:w-auto sm:ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="w-full sm:w-auto px-4 py-2 bg-white/4 border border-white/8 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors text-white text-sm md:text-base"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="createdAt">Sort by Created</option>
            <option value="tag">Sort by Tag</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <div className="text-5xl md:text-6xl mb-4">🧑‍🚀</div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white">Mission board is clear</h3>
            <p className="text-white/60 text-sm md:text-base">No tasks match your current filter</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
      
      <TaskDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editTask={editingTask}
        userId={userId}
      />
    </motion.div>
  );
};
