import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Task } from '../db/db';
import { format } from 'date-fns';

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'> | Task) => void;
  editTask?: Task | null;
  prefilledDate?: string;
  userId: string;
}

const priorityOptions: Array<Task['priority']> = ['low', 'medium', 'high', 'critical'];

const priorityColors = {
  low: '#4ade80',
  medium: '#facc15',
  high: '#f97316',
  critical: '#ef4444',
};

export const TaskDrawer = ({ isOpen, onClose, onSave, editTask, prefilledDate, userId }: TaskDrawerProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [tag, setTag] = useState('');
  
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setDueDate(editTask.dueDate ? format(new Date(editTask.dueDate), "yyyy-MM-dd'T'HH:mm") : '');
      setPriority(editTask.priority);
      setTag(editTask.tag || '');
    } else if (prefilledDate) {
      setDueDate(`${prefilledDate}T09:00`);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setTag('');
    }
  }, [editTask, prefilledDate, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const taskData = {
      userId,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
      status: editTask?.status || 'pending' as const,
      tag: tag.trim() || undefined,
      createdAt: editTask?.createdAt || new Date().toISOString(),
      completedAt: editTask?.completedAt,
    };
    
    if (editTask) {
      onSave({ ...taskData, id: editTask.id });
    } else {
      onSave(taskData);
    }
    
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0d14] border-l border-white/8 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {editTask ? 'Edit Task' : 'Add New Task'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/8 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    required
                    className="w-full px-4 py-2 bg-white/4 border border-white/8 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="Enter task title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-white/4 border border-white/8 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    placeholder="Add details..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 bg-white/4 border border-white/8 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Priority
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {priorityOptions.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          priority === p
                            ? 'ring-2 ring-offset-2 ring-offset-[#0a0d14]'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: `${priorityColors[p]}20`,
                          color: priorityColors[p],
                          borderColor: `${priorityColors[p]}40`,
                          borderWidth: '1px',
                          ...(priority === p ? { boxShadow: `0 0 0 2px ${priorityColors[p]}` } : {}),
                        }}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tag
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-4 py-2 bg-white/4 border border-white/8 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="e.g., work, personal, urgent"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editTask ? 'Update Task' : 'Create Task'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
