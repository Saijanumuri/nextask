import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Moon, Clock, Sparkles } from 'lucide-react';
import { CinematicAudioEngine, type AudioProgress } from '../utils/cinematicAudioEngine';
import type { Story } from '../data/teluguStories';

interface CinematicPlayerProps {
  story: Story;
  onClose: () => void;
  elevenLabsApiKey?: string;
  voiceId?: string;
}

export const CinematicPlayer = ({ story, onClose, elevenLabsApiKey, voiceId }: CinematicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<AudioProgress>({
    currentSegment: 0,
    totalSegments: 0,
    currentLine: '',
    isPlaying: false,
    isPaused: false,
  });
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [showControls, setShowControls] = useState(true);
  const [bedtimeMode, setBedtimeMode] = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  
  const engineRef = useRef<CinematicAudioEngine | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Initialize audio engine
    const engine = new CinematicAudioEngine(story.content, {
      elevenLabsApiKey,
      voiceId: voiceId || 'pNInz6obpgDQGcFmaJgB',
      musicVolume,
      voiceVolume,
      duckingLevel: 0.15, // Music at 15% during speech
    });
    
    // Set background music
    engine.setBackgroundMusic('/audio/music/soft-intro.mp3');
    
    // Progress callback
    engine.onProgress((prog) => {
      setProgress(prog);
    });
    
    // End callback
    engine.onEnd(() => {
      setIsPlaying(false);
    });
    
    engineRef.current = engine;
    
    // Auto-play
    engine.play();
    setIsPlaying(true);
    
    return () => {
      engine.stop();
    };
  }, [story, elevenLabsApiKey]);
  
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setMusicVolume(musicVolume);
    }
  }, [musicVolume]);
  
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setVoiceVolume(voiceVolume);
    }
  }, [voiceVolume]);
  
  useEffect(() => {
    if (sleepTimer && engineRef.current) {
      engineRef.current.setSleepTimer(sleepTimer);
    } else if (engineRef.current) {
      engineRef.current.clearSleepTimer();
    }
  }, [sleepTimer]);
  
  const togglePlay = () => {
    if (!engineRef.current) return;
    
    if (isPlaying) {
      engineRef.current.pause();
      setIsPlaying(false);
    } else {
      engineRef.current.resume();
      setIsPlaying(true);
    }
  };
  
  const handleClose = () => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    onClose();
  };
  
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  const progressPercent = progress.totalSegments > 0 
    ? (progress.currentSegment / progress.totalSegments) * 100 
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-1000 ${
        bedtimeMode 
          ? 'bg-[#020617]' 
          : 'bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]'
      }`}
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent animate-pulse" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl px-6 w-full">
        {/* Series Info */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <p className="text-indigo-400 uppercase tracking-widest text-xs">
            {story.series} • Season {story.season} • Episode {story.episode}
          </p>
          <Sparkles className="w-4 h-4 text-indigo-400" />
        </motion.div>
        
        {/* Story Title */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl md:text-6xl font-bold mb-12 italic text-slate-100 drop-shadow-2xl"
        >
          {story.title}
        </motion.h1>
        
        {/* Current Line Display */}
        <div className="h-32 flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={progress.currentLine}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-3xl text-slate-300 leading-relaxed font-light max-w-3xl"
            >
              {progress.currentLine || 'Starting story...'}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Emotional Message */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mb-8"
        >
          <p className="text-pink-400/80 italic text-sm md:text-base">
            {bedtimeMode ? '"Close your eyes... drift away 🌙"' : '"Relax… you\'re safe ❤️"'}
          </p>
        </motion.div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/40 mt-2">
            <span>Segment {progress.currentSegment} of {progress.totalSegments}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
        </div>
      </div>
      
      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/50 to-transparent pointer-events-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div>
                    <p className="text-sm text-white/60">Now Playing</p>
                    <p className="font-semibold">{story.title}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Bedtime Mode Toggle */}
                  <button
                    onClick={() => setBedtimeMode(!bedtimeMode)}
                    className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                      bedtimeMode 
                        ? 'bg-indigo-500/30 text-indigo-300' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    title="Bedtime Mode"
                  >
                    <Moon className="w-5 h-5" />
                  </button>
                  
                  {/* Sleep Timer */}
                  <div className="relative group">
                    <button
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                        sleepTimer 
                          ? 'bg-pink-500/30 text-pink-300' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      title="Sleep Timer"
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                    
                    {/* Sleep Timer Dropdown */}
                    <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-md rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                      <p className="text-xs text-white/60 mb-2">Auto-stop after:</p>
                      <div className="flex flex-col gap-1">
                        {[10, 20, 30, 60].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => setSleepTimer(sleepTimer === mins ? null : mins)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              sleepTimer === mins
                                ? 'bg-pink-500/30 text-pink-300'
                                : 'hover:bg-white/10'
                            }`}
                          >
                            {mins} min
                          </button>
                        ))}
                        {sleepTimer && (
                          <button
                            onClick={() => setSleepTimer(null)}
                            className="px-3 py-1 rounded-lg text-sm hover:bg-white/10 text-red-400"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent pointer-events-auto">
              <div className="max-w-4xl mx-auto">
                {/* Play/Pause */}
                <div className="flex items-center justify-center mb-6">
                  <button
                    onClick={togglePlay}
                    className="p-6 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 hover:opacity-90 transition-opacity shadow-2xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-black" />
                    ) : (
                      <Play className="w-8 h-8 text-black" />
                    )}
                  </button>
                </div>
                
                {/* Volume Controls */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Voice Volume */}
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Voice</span>
                      <span className="text-sm text-white/80">{Math.round(voiceVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={voiceVolume}
                      onChange={(e) => setVoiceVolume(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                  
                  {/* Music Volume */}
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60 flex items-center gap-2">
                        {musicVolume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        Music
                      </span>
                      <span className="text-sm text-white/80">{Math.round(musicVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(Number(e.target.value))}
                      className="w-full accent-violet-400"
                    />
                  </div>
                </div>
                
                {sleepTimer && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-pink-400">
                      Sleep timer: {sleepTimer} minutes
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
