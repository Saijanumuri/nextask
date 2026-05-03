import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import type { Task } from '../db/db';

interface CalendarGridProps {
  currentMonth: Date;
  tasks: Task[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const priorityColors = {
  low: '#4ade80',
  medium: '#facc15',
  high: '#f97316',
  critical: '#ef4444',
};

export const CalendarGrid = ({ currentMonth, tasks, selectedDate, onDateSelect }: CalendarGridProps) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDay = monthStart.getDay();
  const paddingDays = startDay === 0 ? 6 : startDay - 1;
  
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };
  
  return (
    <div>
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
              onClick={() => onDateSelect(day)}
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
  );
};
