import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimerStore } from '../stores/useTimerStore';
import { useTaskStore } from '../stores/useTaskStore';
import { useAppStore } from '../stores/useAppStore';
import { useAuthStore } from '../stores/useAuthStore';
import { addFocusSession, getTodaySessionCount } from '../db/queries';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const FocusMode = () => {
  const {
    state,
    workDuration,
    breakDuration,
    timeRemaining,
    selectedTaskId,
    sessionCount,
    setState,
    setWorkDuration,
    setBreakDuration,
    setTimeRemaining,
    setSelectedTaskId,
    incrementSessionCount,
    resetTimer,
    tick,
  } = useTimerStore();
  
  const { tasks, loadTasks } = useTaskStore();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { currentUser } = useAuthStore();
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [todaySessionCount, setTodaySessionCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const userId = currentUser?.passkey || '';
  
  useEffect(() => {
    if (userId) {
      loadTasks(userId);
      loadSessionCount();
    }
    
    // Hide sidebar in focus mode
    if (!sidebarCollapsed) {
      toggleSidebar();
    }
  }, [userId]);
  
  useEffect(() => {
    let interval: number;
    if (state === 'running') {
      interval = window.setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [state, tick]);
  
  useEffect(() => {
    if (timeRemaining === 0 && state === 'running') {
      handleSessionComplete();
    }
  }, [timeRemaining, state]);
  
  const loadSessionCount = async () => {
    if (!userId) return;
    const count = await getTodaySessionCount(userId);
    setTodaySessionCount(count);
  };
  
  const handleSessionComplete = async () => {
    if (sessionStartTime && userId) {
      const endTime = new Date().toISOString();
      await addFocusSession({
        userId,
        taskId: selectedTaskId || undefined,
        startTime: sessionStartTime,
        endTime,
        duration: workDuration * 60,
      });
      
      incrementSessionCount();
      await loadSessionCount();
      setSessionStartTime(null);
    }
    
    setState('done');
    setShowConfetti(true);
    drawConfetti();
    
    setTimeout(() => {
      setShowConfetti(false);
      setState('idle');
      setTimeRemaining(workDuration * 60);
    }, 3000);
  };
  
  const handleStart = () => {
    if (state === 'idle') {
      setSessionStartTime(new Date().toISOString());
      setTimeRemaining(workDuration * 60);
    }
    setState('running');
  };
  
  const handlePause = () => {
    setState('paused');
  };
  
  const handleReset = () => {
    resetTimer();
    setSessionStartTime(null);
  };
  
  const drawConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
    }> = [];
    
    const colors = ['#00f5d4', '#7b2fff', '#ff2244', '#a3ff4f', '#ffb800'];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      
      if (particles.some(p => p.y < canvas.height)) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };
  
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = ((workDuration * 60 - timeRemaining) / (workDuration * 60)) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-center justify-center min-h-[calc(100vh-8rem)]"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Focus Mode</h1>
        
        <div className="relative inline-block mb-12">
          <svg width="300" height="300" className="transform -rotate-90">
            <circle
              cx="150"
              cy="150"
              r="120"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="150"
              cy="150"
              r="120"
              stroke="#00f5d4"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-['JetBrains_Mono'] text-6xl font-semibold text-cyan-400">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-12">
          {state === 'running' ? (
            <button
              onClick={handlePause}
              className="p-6 rounded-full bg-violet-500 hover:bg-violet-600 transition-colors"
            >
              <Pause className="w-8 h-8" />
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="p-6 rounded-full bg-cyan-400 text-black hover:bg-cyan-500 transition-colors"
            >
              <Play className="w-8 h-8" />
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="p-6 rounded-full border border-white/16 hover:bg-white/8 transition-colors"
          >
            <RotateCcw className="w-8 h-8" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm text-white/60 mb-2">Work Duration (min)</label>
            <input
              type="range"
              min="5"
              max="90"
              value={workDuration}
              onChange={(e) => setWorkDuration(Number(e.target.value))}
              disabled={state === 'running'}
              className="w-full"
            />
            <div className="text-2xl font-['JetBrains_Mono'] mt-2">{workDuration}</div>
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">Break Duration (min)</label>
            <input
              type="range"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              disabled={state === 'running'}
              className="w-full"
            />
            <div className="text-2xl font-['JetBrains_Mono'] mt-2">{breakDuration}</div>
          </div>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm text-white/60 mb-2">Select Task (Optional)</label>
          <select
            value={selectedTaskId || ''}
            onChange={(e) => setSelectedTaskId(e.target.value ? Number(e.target.value) : null)}
            disabled={state === 'running'}
            className="w-full px-4 py-3 bg-white/4 border border-white/8 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
          >
            <option value="">No task selected</option>
            {pendingTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-white/60">
          Session {sessionCount} of {todaySessionCount} today
        </div>
      </div>
      
      {showConfetti && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50"
        />
      )}
    </motion.div>
  );
};
