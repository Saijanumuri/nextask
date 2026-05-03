import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useTaskStore } from '../stores/useTaskStore';
import { useStreakStore } from '../stores/useStreakStore';
import { useAuthStore } from '../stores/useAuthStore';
import { StreakCard } from '../components/StreakCard';
import { TaskCard } from '../components/TaskCard';
import { TaskDrawer } from '../components/TaskDrawer';
import { getTodayTasks, getTodayCompletedCount, getTodayFocusTime } from '../db/queries';
import type { Task } from '../db/db';
import { Clock, CheckCircle2, Brain } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const Dashboard = () => {
  const [greeting, setGreeting] = useState('');
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [focusTimeToday, setFocusTimeToday] = useState(0);
  const [quickAddValue, setQuickAddValue] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { addNewTask, updateExistingTask, removeTask, toggleTaskComplete, loadTasks } = useTaskStore();
  const { loadStreaks } = useStreakStore();
  const { currentUser } = useAuthStore();
  
  const userId = currentUser?.passkey || '';
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    if (userId) {
      loadData();
    }
  }, [userId]);
  
  const loadData = async () => {
    if (!userId) return;
    
    await loadTasks(userId);
    await loadStreaks(userId);
    const tasks = await getTodayTasks(userId);
    const completed = await getTodayCompletedCount(userId);
    const focusTime = await getTodayFocusTime(userId);
    
    setTodayTasks(tasks);
    setCompletedToday(completed);
    setFocusTimeToday(focusTime);
  };
  
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddValue.trim() || !userId) return;
    
    await addNewTask({
      userId,
      title: quickAddValue.trim(),
      priority: 'medium',
      status: 'pending',
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    
    setQuickAddValue('');
    loadData();
  };
  
  const handleToggleComplete = async (id: number, isCompleted: boolean) => {
    if (!userId) return;
    await toggleTaskComplete(id, isCompleted, userId);
    loadData();
  };
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDrawerOpen(true);
  };
  
  const handleDelete = async (id: number) => {
    await removeTask(id);
    loadData();
  };
  
  const handleSaveTask = async (task: Omit<Task, 'id'> | Task) => {
    if ('id' in task) {
      await updateExistingTask(task.id!, task);
    } else {
      await addNewTask(task);
    }
    setIsDrawerOpen(false);
    setEditingTask(null);
    loadData();
  };
  
  const focusHours = Math.floor(focusTimeToday / 3600);
  const focusMins = Math.floor((focusTimeToday % 3600) / 60);
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          {greeting}, {currentUser?.name || 'User'}! 👋
        </h1>
        <p className="text-white/60 text-sm md:text-base">{format(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
        <p className="text-white/50 text-xs md:text-sm mt-1">
          You have {todayTasks.filter(t => t.status === 'pending').length} tasks due today
        </p>
      </div>
      
      <div className="mb-6 md:mb-8">
        <StreakCard />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white/80 text-sm md:text-base">Due Today</h3>
          </div>
          <p className="text-3xl md:text-4xl font-bold font-['JetBrains_Mono'] text-white">
            {todayTasks.length}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <h3 className="text-white/80 text-sm md:text-base">Completed Today</h3>
          </div>
          <p className="text-3xl md:text-4xl font-bold font-['JetBrains_Mono'] text-white">
            {completedToday}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-5 h-5 text-violet-400" />
            <h3 className="text-white/80 text-sm md:text-base">Focus Time Today</h3>
          </div>
          <p className="text-3xl md:text-4xl font-bold font-['JetBrains_Mono'] text-white">
            {focusHours}h {focusMins}m
          </p>
        </motion.div>
      </div>
      
      <div className="mb-4 md:mb-6">
        <form onSubmit={handleQuickAdd}>
          <input
            type="text"
            value={quickAddValue}
            onChange={(e) => setQuickAddValue(e.target.value)}
            placeholder="Add a task... press Enter"
            className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl focus:outline-none focus:border-cyan-400 transition-colors text-base md:text-lg text-white placeholder:text-white/40"
          />
        </form>
      </div>
      
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Today's Tasks</h2>
        <div className="space-y-3">
          {todayTasks.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              <p className="text-base md:text-lg">No tasks for today</p>
              <p className="text-xs md:text-sm mt-2">Add a task above to get started</p>
            </div>
          ) : (
            todayTasks.map((task) => (
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
