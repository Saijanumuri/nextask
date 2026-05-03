import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, BookOpen, Heart, User, Users, Baby, Sparkles, Settings } from 'lucide-react';
import { teluguStories, storyCategories, type Story } from '../data/teluguStories';
import { StoryAudioPlayer } from '../utils/storyAudioParser';
import { CinematicPlayer } from '../components/CinematicPlayer';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const narratorIcons = {
  male: User,
  female: Users,
  kid: Baby,
};

const narratorLabels = {
  male: 'పురుష గొంతు (Male Voice)',
  female: 'స్త్రీ గొంతు (Female Voice)',
  kid: 'పిల్లల గొంతు (Kid Voice)',
};

export const Stories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [totalSegments, setTotalSegments] = useState(0);
  const [volume, setVolume] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [cinematicMode, setCinematicMode] = useState(false);
  const [cinematicStory, setCinematicStory] = useState<Story | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState('pNInz6obpgDQGcFmaJgB');
  const [testingApi, setTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{success: boolean; message: string} | null>(null);
  
  const audioPlayerRef = useRef<StoryAudioPlayer | null>(null);
  
  // Available ElevenLabs voices
  const availableVoices = [
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Multilingual)', language: 'English/Telugu' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Multilingual)', language: 'English/Telugu' },
    { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian (Multilingual)', language: 'English/Telugu' },
    { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum (Multilingual)', language: 'English/Telugu' },
  ];
  
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('storyFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Load ElevenLabs API key
    const savedApiKey = localStorage.getItem('elevenLabsApiKey');
    if (savedApiKey) {
      setElevenLabsApiKey(savedApiKey);
    }
    
    // Load selected voice
    const savedVoiceId = localStorage.getItem('elevenLabsVoiceId');
    if (savedVoiceId) {
      setSelectedVoiceId(savedVoiceId);
    }
    
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.stop();
      }
    };
  }, []);
  
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.setVolume(volume);
    }
  }, [volume]);
  
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.setSpeechRate(speechRate);
    }
  }, [speechRate]);
  
  const filteredStories = selectedCategory === 'all' 
    ? teluguStories 
    : teluguStories.filter(story => story.category === selectedCategory);
  
  const playStory = (story: Story) => {
    // If clicking the same story that's playing, just toggle play/pause
    if (selectedStory?.id === story.id && isPlaying) {
      pauseStory();
      return;
    }
    
    // Stop current playback
    if (audioPlayerRef.current) {
      audioPlayerRef.current.stop();
    }
    
    setSelectedStory(story);
    setCurrentSegment(0);
    
    // Create new audio player with parsed content
    const player = new StoryAudioPlayer(story.content);
    player.setVolume(volume);
    player.setSpeechRate(speechRate);
    
    // Set up progress callback
    player.onProgress((current, total) => {
      setCurrentSegment(current);
      setTotalSegments(total);
    });
    
    // Set up end callback
    player.onEnd(() => {
      setIsPlaying(false);
      setCurrentSegment(0);
    });
    
    audioPlayerRef.current = player;
    setTotalSegments(player.getTotalSegments());
    
    // Start playing
    player.play();
    setIsPlaying(true);
  };
  
  const pauseStory = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlaying(false);
  };
  
  const resumeStory = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.resume();
      setIsPlaying(true);
    }
  };
  
  const stopStory = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.stop();
    }
    setIsPlaying(false);
    setCurrentSegment(0);
  };
  
  const toggleFavorite = (storyId: string) => {
    const newFavorites = favorites.includes(storyId)
      ? favorites.filter(id => id !== storyId)
      : [...favorites, storyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('storyFavorites', JSON.stringify(newFavorites));
  };
  
  const testElevenLabs = async () => {
    setTestingApi(true);
    setApiTestResult(null);
    
    try {
      console.log('🧪 Testing ElevenLabs API...');
      console.log('API Key:', elevenLabsApiKey.substring(0, 10) + '...');
      console.log('Voice ID:', selectedVoiceId);
      
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': elevenLabsApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: 'Testing Telugu voice. టెస్టింగ్ తెలుగు వాయిస్.',
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const blob = await response.blob();
        console.log('✅ Success! Blob size:', blob.size);
        
        // Play the test audio
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
        
        setApiTestResult({
          success: true,
          message: '✅ API key works! Playing test audio...'
        });
      } else {
        const errorText = await response.text();
        console.error('❌ Error:', response.status, errorText);
        
        let errorMessage = `❌ Error ${response.status}: `;
        if (response.status === 401) {
          errorMessage += 'Invalid API key';
        } else if (response.status === 429) {
          errorMessage += 'Rate limit exceeded or quota exhausted';
        } else if (response.status === 422) {
          errorMessage += 'Invalid voice ID or request';
        } else {
          errorMessage += errorText;
        }
        
        setApiTestResult({
          success: false,
          message: errorMessage
        });
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setApiTestResult({
        success: false,
        message: '❌ Network error: ' + (error as Error).message
      });
    } finally {
      setTestingApi(false);
    }
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
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
            తెలుగు కథలు
          </h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl border border-white/16 hover:bg-white/8 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <p className="text-white/60 text-sm md:text-base">Telugu Stories - Listen while you work</p>
        
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 bg-white/4 backdrop-blur-md border border-white/8 rounded-xl overflow-hidden"
            >
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Premium Features
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1">
                    ElevenLabs API Key (Optional - for premium Telugu voice)
                  </label>
                  <input
                    type="password"
                    value={elevenLabsApiKey}
                    onChange={(e) => {
                      setElevenLabsApiKey(e.target.value);
                      localStorage.setItem('elevenLabsApiKey', e.target.value);
                    }}
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Get your API key from <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">elevenlabs.io</a>
                  </p>
                </div>
                
                {elevenLabsApiKey && (
                  <div>
                    <label className="block text-xs text-white/60 mb-1">
                      Voice Selection
                    </label>
                    <select
                      value={selectedVoiceId}
                      onChange={(e) => {
                        setSelectedVoiceId(e.target.value);
                        localStorage.setItem('elevenLabsVoiceId', e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-white/4 border border-white/8 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                    >
                      {availableVoices.map((voice) => (
                        <option key={voice.id} value={voice.id} className="bg-[#080a0f]">
                          {voice.name} - {voice.language}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-green-400">
                        ✓ ElevenLabs enabled
                      </p>
                      <button
                        onClick={testElevenLabs}
                        disabled={testingApi}
                        className="px-3 py-1 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-lg text-xs transition-colors disabled:opacity-50"
                      >
                        {testingApi ? 'Testing...' : 'Test API'}
                      </button>
                    </div>
                    {apiTestResult && (
                      <div className={`mt-2 p-2 rounded-lg text-xs ${
                        apiTestResult.success 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {apiTestResult.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <p className="text-cyan-400 text-sm">
            🎵 Stories include music cues and pauses for immersive experience
          </p>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {storyCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap text-sm md:text-base ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-cyan-400 to-violet-500 text-black'
                : 'border border-white/16 text-white/70 hover:bg-white/8'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Stories List */}
        <div className="space-y-3">
          {filteredStories.map((story) => {
            const NarratorIcon = narratorIcons[story.narrator];
            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/4 backdrop-blur-md border rounded-2xl p-4 md:p-6 transition-all cursor-pointer ${
                  selectedStory?.id === story.id
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-white/8 hover:bg-white/8'
                }`}
                onClick={() => playStory(story)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg md:text-xl font-semibold text-white">
                        {story.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(story.id);
                        }}
                        className="p-1 rounded-lg hover:bg-white/8 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.includes(story.id)
                              ? 'fill-red-400 text-red-400'
                              : 'text-white/40'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-white/60 mb-3">{story.titleEnglish}</p>
                    <div className="flex items-center gap-3 text-xs text-white/50 flex-wrap">
                      <span className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded-lg flex items-center gap-1">
                        <NarratorIcon className="w-3 h-3" />
                        {story.narrator === 'male' ? 'పురుష' : story.narrator === 'female' ? 'స్త్రీ' : 'పిల్లల'}
                      </span>
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg">
                        {storyCategories.find(c => c.id === story.category)?.nameEnglish}
                      </span>
                      <span>{story.duration}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Cinematic Mode Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCinematicStory(story);
                        setCinematicMode(true);
                      }}
                      className="p-4 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition-opacity"
                      title="Cinematic Mode"
                    >
                      <Sparkles className="w-5 h-5" />
                    </button>
                    
                    {/* Regular Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedStory?.id === story.id && isPlaying) {
                          pauseStory();
                        } else if (selectedStory?.id === story.id && !isPlaying) {
                          resumeStory();
                        } else {
                          playStory(story);
                        }
                      }}
                      className={`p-4 rounded-full transition-colors ${
                        selectedStory?.id === story.id && isPlaying
                          ? 'bg-violet-500 hover:bg-violet-600'
                          : 'bg-cyan-400 text-black hover:bg-cyan-500'
                      }`}
                    >
                      {selectedStory?.id === story.id && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Story Player & Content */}
        <div className="space-y-4">
          {/* Audio Controls */}
          {selectedStory && (
            <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-2 text-white">Now Playing</h3>
              <p className="text-white/80 mb-1">{selectedStory.title}</p>
              <p className="text-white/50 text-sm mb-4">{narratorLabels[selectedStory.narrator]}</p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-violet-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalSegments > 0 ? (currentSegment / totalSegments) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>Segment {currentSegment} of {totalSegments}</span>
                  <span>{Math.round((currentSegment / totalSegments) * 100)}%</span>
                </div>
                <p className="text-xs text-cyan-400 mt-2">
                  🎵 Music and pauses are automatically played
                </p>
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => {
                    if (isPlaying) {
                      pauseStory();
                    } else {
                      resumeStory();
                    }
                  }}
                  className="p-4 rounded-full bg-cyan-400 text-black hover:bg-cyan-500 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                
                <button
                  onClick={stopStory}
                  disabled={!isPlaying && currentSegment === 0}
                  className="p-4 rounded-full border border-white/16 hover:bg-white/8 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
              
              {/* Speed Control */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-white/60">Speech Speed</label>
                  <span className="text-sm text-white/80">{speechRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              {/* Volume Control */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-white/60 flex items-center gap-2">
                    {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    Volume
                  </label>
                  <span className="text-sm text-white/80">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
          
          {/* Story Content */}
          {selectedStory && (
            <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Story Content</h3>
              <div className="text-white/70 text-sm md:text-base leading-relaxed whitespace-pre-line mb-4 max-h-[400px] overflow-y-auto">
                {selectedStory.content}
              </div>
              {selectedStory.moral && (
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-xs text-amber-400 mb-1 font-semibold">నీతి / Moral:</p>
                  <p className="text-sm text-amber-300/90">{selectedStory.moral}</p>
                </div>
              )}
            </div>
          )}
          
          {!selectedStory && (
            <div className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-12 text-center">
              <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 mb-2">Select a story to start listening</p>
              <p className="text-white/30 text-sm">Click on any story card to begin</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Cinematic Player */}
      <AnimatePresence>
        {cinematicMode && cinematicStory && (
          <CinematicPlayer
            story={cinematicStory}
            onClose={() => {
              setCinematicMode(false);
              setCinematicStory(null);
            }}
            elevenLabsApiKey={elevenLabsApiKey || undefined}
            voiceId={selectedVoiceId}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
