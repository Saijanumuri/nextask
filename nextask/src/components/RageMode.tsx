import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../stores/useAppStore';

export const RageMode = () => {
  const { rageMode, setRageMode } = useAppStore();
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  
  useEffect(() => {
    if (rageMode) {
      setTimeRemaining(15 * 60);
      
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setRageMode(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [rageMode, setRageMode]);
  
  useEffect(() => {
    if (rageMode) {
      document.body.style.cursor = 'crosshair';
    } else {
      document.body.style.cursor = 'default';
    }
    
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [rageMode]);
  
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  return (
    <AnimatePresence>
      {rageMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 pointer-events-none z-30"
          style={{
            background: 'linear-gradient(135deg, #1a0008 0%, #0a0003 100%)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                opacity: [0.05, 0.15, 0.05],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="font-['JetBrains_Mono'] text-[200px] font-bold text-red-500/10 select-none"
            >
              RAGE MODE
            </motion.div>
          </div>
          
          <div className="absolute top-24 right-6 pointer-events-auto">
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 backdrop-blur-md">
              <div className="font-['JetBrains_Mono'] text-3xl text-red-400 mb-2">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <button
                onClick={() => setRageMode(false)}
                className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                CALM DOWN
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
