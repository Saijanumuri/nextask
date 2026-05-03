import { motion } from 'framer-motion';
import { MoreVertical, Trash2, Edit } from 'lucide-react';
import type { Task } from '../db/db';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: number, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const priorityColors = {
  low: '#4ade80',
  medium: '#facc15',
  high: '#f97316',
  critical: '#ef4444',
};

export const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const isCompleted = task.status === 'completed';
  
  const handleCheckboxChange = () => {
    onToggleComplete(task.id!, !isCompleted);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, height: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-4 hover:border-white/16 hover:bg-white/6 transition-all"
    >
      <div className="flex items-start gap-3">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleCheckboxChange}
          className={`mt-1 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-cyan-400 border-cyan-400'
              : 'border-white/40 hover:border-cyan-400'
          }`}
        >
          {isCompleted && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </motion.button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-base md:text-lg ${isCompleted ? 'line-through text-white/40' : 'text-white'}`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-xs md:text-sm text-white/50 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {task.dueDate && (
              <span className="text-xs text-white/60">
                {format(parseISO(task.dueDate), 'MMM dd, HH:mm')}
              </span>
            )}
            
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium ${
                task.priority === 'critical' ? 'animate-pulse' : ''
              }`}
              style={{
                backgroundColor: `${priorityColors[task.priority]}20`,
                color: priorityColors[task.priority],
                borderColor: `${priorityColors[task.priority]}40`,
                borderWidth: '1px',
              }}
            >
              {task.priority}
            </span>
            
            {task.tag && (
              <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40 font-medium">
                {task.tag}
              </span>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-[#1a1d2e] border border-white/16 rounded-lg shadow-xl z-10">
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/8 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task.id!);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
