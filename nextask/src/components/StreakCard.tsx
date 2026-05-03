import { motion } from 'framer-motion';
import { useStreakStore } from '../stores/useStreakStore';

const milestones = [7, 14, 30, 60, 100, 365];

export const StreakCard = () => {
  const { currentStreak, longestStreak } = useStreakStore();
  
  const nextMilestone = milestones.find(m => m > currentStreak) || 365;
  const progress = (currentStreak / nextMilestone) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 text-[200px] opacity-5 select-none">
        🔥
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base md:text-lg text-white/70 mb-2">Current Streak</h2>
            <div className="flex items-baseline gap-2">
              <span className="font-['JetBrains_Mono'] text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text">
                {currentStreak}
              </span>
              <span className="text-xl md:text-2xl text-white/70">days</span>
            </div>
          </div>
          
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-7xl md:text-8xl"
          >
            🔥
          </motion.div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs md:text-sm text-white/70 mb-2">
            <span>Progress to {nextMilestone} days</span>
            <span>{currentStreak} / {nextMilestone}</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-white/70">Longest streak:</span>
          <span className="font-semibold text-amber-400">{longestStreak} days</span>
        </div>
      </div>
    </motion.div>
  );
};
