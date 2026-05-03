import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Flag, Save, Trash2 } from 'lucide-react';
import { useStopwatchStore } from '../stores/useStopwatchStore';
import { useAuthStore } from '../stores/useAuthStore';
import { format, parseISO } from 'date-fns';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const Stopwatch = () => {
  const {
    isRunning,
    elapsed,
    laps,
    sessions,
    start,
    pause,
    reset,
    addLap,
    saveSession,
    loadSessions,
    deleteSession,
    tick,
  } = useStopwatchStore();
  
  const { currentUser } = useAuthStore();
  const [sessionLabel, setSessionLabel] = useState('');
  const lastTimeRef = useRef<number>(Date.now());
  
  const userId = currentUser?.passkey || '';
  
  useEffect(() => {
    if (userId) {
      loadSessions(userId);
    }
  }, [userId]);
  
  useEffect(() => {
    let animationFrame: number;
    
    const animate = () => {
      if (isRunning) {
        const now = Date.now();
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;
        tick(delta);
      }
      animationFrame = requestAnimationFrame(animate);
    };
    
    lastTimeRef.current = Date.now();
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isRunning, tick]);
  
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };
  
  const handleToggle = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };
  
  const handleSave = async () => {
    if (!sessionLabel.trim()) {
      alert('Please enter a session label');
      return;
    }
    
    if (!userId) return;
    
    await saveSession(sessionLabel.trim(), userId);
    setSessionLabel('');
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
      <h1 className="text-4xl font-bold mb-12">Stopwatch</h1>
      
      <div className="grid grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-12 text-center">
            <div className="font-['JetBrains_Mono'] text-7xl font-semibold text-cyan-400 glow-cyan mb-8">
              {formatTime(elapsed)}
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleToggle}
                className={`p-6 rounded-full transition-colors ${
                  isRunning
                    ? 'bg-violet-500 hover:bg-violet-600'
                    : 'bg-cyan-400 text-black hover:bg-cyan-500'
                }`}
              >
                {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
              
              <button
                onClick={addLap}
                disabled={!isRunning}
                className="p-6 rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Flag className="w-8 h-8" />
              </button>
              
              <button
                onClick={reset}
                className="p-6 rounded-full border border-white/16 hover:bg-white/8 transition-colors"
              >
                <RotateCcw className="w-8 h-8" />
              </button>
            </div>
          </div>
          
          {(elapsed > 0 || laps.length > 0) && (
            <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Save Session</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={sessionLabel}
                  onChange={(e) => setSessionLabel(e.target.value)}
                  placeholder="Session label (e.g., Morning sprint)"
                  className="flex-1 px-4 py-3 bg-white/4 border border-white/8 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save
                </button>
              </div>
            </div>
          )}
          
          {laps.length > 0 && (
            <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Laps</h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {laps.map((lap, index) => {
                  const split = index === 0 ? lap : lap - laps[index - 1];
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-4 bg-white/4 rounded-lg"
                    >
                      <span className="text-white/60">Lap {laps.length - index}</span>
                      <div className="flex gap-8">
                        <span className="font-['JetBrains_Mono']">{formatTime(split)}</span>
                        <span className="font-['JetBrains_Mono'] text-white/60">{formatTime(lap)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Saved Sessions</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                <p>No saved sessions</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white/4 rounded-xl p-4 border border-white/8"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{session.label}</h3>
                    <button
                      onClick={() => deleteSession(session.id!, userId)}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-white/60 mb-2">
                    {format(parseISO(session.savedAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                  <div className="font-['JetBrains_Mono'] text-lg text-cyan-400">
                    {formatTime(session.elapsed)}
                  </div>
                  {session.laps.length > 0 && (
                    <div className="text-xs text-white/50 mt-2">
                      {session.laps.length} laps
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
