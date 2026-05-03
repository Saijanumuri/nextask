import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Zap, LogOut, Menu, X } from 'lucide-react';
import { format } from 'date-fns';
import { useStreakStore } from '../stores/useStreakStore';
import { useAppStore } from '../stores/useAppStore';
import { useAuthStore } from '../stores/useAuthStore';

export const TopBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  
  const { currentStreak } = useStreakStore();
  const { soundEnabled, setSoundEnabled, rageMode, setRageMode, sidebarCollapsed, toggleSidebar } = useAppStore();
  const { logout } = useAuthStore();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    let interval: number;
    if (isHolding) {
      interval = window.setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            setIsHolding(false);
            setRageMode(true);
            return 0;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      setHoldProgress(0);
    }
    
    return () => clearInterval(interval);
  }, [isHolding, setRageMode]);
  
  const handleMouseDown = () => {
    setIsHolding(true);
  };
  
  const handleMouseUp = () => {
    setIsHolding(false);
  };
  
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };
  
  const timeString = format(currentTime, 'HH:mm:ss');
  const dateString = format(currentTime, 'EEEE, dd MMMM yyyy');
  
  return (
    <div className="h-16 md:h-20 bg-white/4 backdrop-blur-md border-b border-white/8 px-3 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-8">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-white/8 transition-colors"
        >
          {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
        
        <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
          NexTask
        </h1>
        
        <div className={`hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl ${currentStreak > 7 ? 'glow-amber' : ''}`}>
          <span className="text-xl md:text-2xl">🔥</span>
          <span className="text-sm md:text-lg font-semibold text-amber-400">
            {currentStreak} <span className="hidden md:inline">day streak</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-6">
        <div className="hidden lg:block text-right">
          <div className="font-['JetBrains_Mono'] text-base md:text-[22px] text-cyan-400 font-semibold">
            {timeString.split('').map((char, i) => (
              <span 
                key={i} 
                className={char === ':' ? '' : i === timeString.length - 1 ? 'animate-pulse' : ''}
              >
                {char}
              </span>
            ))}
          </div>
          <div className="text-[10px] md:text-xs text-white/50">{dateString}</div>
        </div>
        
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg border border-white/16 hover:bg-white/8 transition-colors"
          title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white/50" />
          )}
        </button>
        
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className={`relative px-2 md:px-4 py-1.5 md:py-2 rounded-xl font-semibold transition-all overflow-hidden text-xs md:text-base ${
            rageMode 
              ? 'bg-red-500 text-white glow-red' 
              : 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
          }`}
          title="Hold for 2 seconds to activate RAGE MODE"
        >
          <div 
            className="absolute inset-0 bg-red-500 transition-all"
            style={{ 
              width: `${holdProgress}%`,
              opacity: 0.3,
            }}
          />
          <div className="relative flex items-center gap-1 md:gap-2">
            <Zap className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">RAGE</span>
          </div>
        </button>
        
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg border border-white/16 hover:bg-red-500/20 hover:border-red-500/40 transition-colors group"
          title="Logout"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5 text-white/50 group-hover:text-red-400" />
        </button>
      </div>
    </div>
  );
};
