import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { useTaskStore } from '../stores/useTaskStore';
import { useAuthStore } from '../stores/useAuthStore';
import { TaskDrawer } from '../components/TaskDrawer';
import { TaskCard } from '../components/TaskCard';
import type { Task } from '../db/db';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const priorityColors = {
  low: '#4ade80',
  medium: '#facc15',
  high: '#f97316',
  critical: '#ef4444',
};

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { tasks, loadTasks, addNewTask, updateExistingTask, removeTask, toggleTaskComplete } = useTaskStore();
  const { currentUser } = useAuthStore();
  
  const userId = currentUser?.passkey || '';
  
  useEffect(() => {
    if (userId) {
      loadTasks(userId);
    }
  }, [userId]);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Pad the start to align with Monday
  const startDay = monthStart.getDay();
  const paddingDays = startDay === 0 ? 6 : startDay - 1;
  
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return isSameDay(parseISO(task.dueDate), date);
    });
  };
  
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  
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
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Calendar</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg border border-white/16 hover:bg-white/8 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xl font-semibold min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg border border-white/16 hover:bg-white/8 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-white/60 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: paddingDays }).map((_, i) => (
              <div key={`padding-${i}`} className="aspect-square" />
            ))}
            
            {daysInMonth.map((day) => {
              const dayTasks = getTasksForDate(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-xl p-2 transition-all ${
                    isToday
                      ? 'border-2 border-cyan-400 bg-cyan-400/10'
                      : isSelected
                      ? 'bg-white/16 border border-white/30'
                      : 'border border-white/8 hover:bg-white/8'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">
                    {format(day, 'd')}
                  </div>
                  <div className="flex gap-1 justify-center flex-wrap">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: priorityColors[task.priority] }}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-[8px] text-white/50">
                        +{dayTasks.length - 3}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {format(selectedDate, 'EEE, MMM dd')}
                </h2>
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setIsDrawerOpen(true);
                  }}
                  className="p-2 rounded-lg bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30 transition-colors"
                  title="Add task on this date"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {selectedDateTasks.length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    <p>No tasks for this day</p>
                  </div>
                ) : (
                  selectedDateTasks.map((task) => (
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
            </>
          ) : (
            <div className="text-center py-20 text-white/50">
              <p>Select a date to view tasks</p>
            </div>
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
        prefilledDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined}
        userId={userId}
      />
    </motion.div>
  );
};
