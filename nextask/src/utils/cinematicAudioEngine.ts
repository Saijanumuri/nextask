// Cinematic Audio Engine - Premium audio experience with ducking and ElevenLabs

import { parseStoryContent, type AudioSegment } from './storyAudioParser';

export interface CinematicAudioConfig {
  elevenLabsApiKey?: string;
  voiceId?: string;
  musicVolume?: number;
  voiceVolume?: number;
  duckingLevel?: number; // How much to reduce music during speech (0-1)
  fadeInDuration?: number; // ms
  fadeOutDuration?: number; // ms
}

export interface AudioProgress {
  currentSegment: number;
  totalSegments: number;
  currentLine: string;
  isPlaying: boolean;
  isPaused: boolean;
}

/**
 * Premium Cinematic Audio Player with:
 * - ElevenLabs Telugu voice generation
 * - Smart audio ducking (music lowers during speech)
 * - Smooth fade in/out
 * - Audio caching
 * - Sleep timer support
 */
export class CinematicAudioEngine {
  private segments: AudioSegment[];
  private currentSegmentIndex: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  
  private musicAudio: HTMLAudioElement | null = null;
  private voiceAudio: HTMLAudioElement | null = null;
  
  private config: Required<CinematicAudioConfig>;
  private onProgressCallback?: (progress: AudioProgress) => void;
  private onEndCallback?: () => void;
  private pauseTimeout: number | null = null;
  private sleepTimer: number | null = null;
  
  // Audio ducking
  private isDucking: boolean = false;
  private duckingInterval: number | null = null;
  
  constructor(content: string, config: CinematicAudioConfig = {}) {
    this.segments = parseStoryContent(content);
    this.config = {
      elevenLabsApiKey: config.elevenLabsApiKey || '',
      voiceId: config.voiceId || 'pNInz6obpgDQGcFmaJgB', // Default: Adam voice (multilingual)
      musicVolume: config.musicVolume ?? 0.3,
      voiceVolume: config.voiceVolume ?? 1.0,
      duckingLevel: config.duckingLevel ?? 0.1, // Reduce to 10% during speech
      fadeInDuration: config.fadeInDuration ?? 2000,
      fadeOutDuration: config.fadeOutDuration ?? 3000,
    };
  }
  
  // Set ElevenLabs API key
  setApiKey(apiKey: string) {
    this.config.elevenLabsApiKey = apiKey;
  }
  
  // Set background music
  setBackgroundMusic(musicUrl: string) {
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
    this.musicAudio = new Audio(musicUrl);
    this.musicAudio.loop = true;
    this.musicAudio.volume = this.config.musicVolume;
  }
  
  // Volume controls
  setMusicVolume(volume: number) {
    this.config.musicVolume = volume;
    if (this.musicAudio && !this.isDucking) {
      this.musicAudio.volume = volume;
    }
  }
  
  setVoiceVolume(volume: number) {
    this.config.voiceVolume = volume;
    if (this.voiceAudio) {
      this.voiceAudio.volume = volume;
    }
  }
  
  // Progress callback
  onProgress(callback: (progress: AudioProgress) => void) {
    this.onProgressCallback = callback;
  }
  
  // End callback
  onEnd(callback: () => void) {
    this.onEndCallback = callback;
  }
  
  // Sleep timer (auto-stop after duration)
  setSleepTimer(minutes: number) {
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
    }
    
    this.sleepTimer = window.setTimeout(() => {
      this.fadeOutAndStop();
    }, minutes * 60 * 1000);
  }
  
  clearSleepTimer() {
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
  }
  
  // Start playback
  async play() {
    if (this.isPaused) {
      this.resume();
      return;
    }
    
    this.isPlaying = true;
    this.currentSegmentIndex = 0;
    
    // Start background music with fade in
    if (this.musicAudio) {
      this.musicAudio.volume = 0;
      this.musicAudio.play();
      this.fadeVolume(this.musicAudio, 0, this.config.musicVolume, this.config.fadeInDuration);
    }
    
    // Wait a bit before starting narration
    await new Promise(resolve => setTimeout(resolve, 800));
    
    await this.playNextSegment();
  }
  
  // Play next segment
  private async playNextSegment() {
    if (!this.isPlaying || this.currentSegmentIndex >= this.segments.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }
    
    const segment = this.segments[this.currentSegmentIndex];
    
    // Update progress
    if (this.onProgressCallback) {
      this.onProgressCallback({
        currentSegment: this.currentSegmentIndex,
        totalSegments: this.segments.length,
        currentLine: segment.content,
        isPlaying: this.isPlaying,
        isPaused: this.isPaused,
      });
    }
    
    switch (segment.type) {
      case 'music':
        await this.playMusicSegment(segment);
        break;
      case 'pause':
        await this.playPauseSegment(segment);
        break;
      case 'text':
        await this.playTextSegment(segment);
        break;
    }
    
    this.currentSegmentIndex++;
    await this.playNextSegment();
  }
  
  // Play music segment
  private async playMusicSegment(segment: AudioSegment): Promise<void> {
    return new Promise((resolve) => {
      const musicFile = this.getMusicFile(segment.musicType);
      
      if (musicFile) {
        const audio = new Audio(musicFile);
        audio.volume = this.config.musicVolume;
        
        audio.onended = () => resolve();
        audio.onerror = () => setTimeout(resolve, (segment.duration || 2) * 1000);
        
        audio.play().catch(() => setTimeout(resolve, (segment.duration || 2) * 1000));
      } else {
        setTimeout(resolve, (segment.duration || 2) * 1000);
      }
    });
  }
  
  // Play pause segment
  private async playPauseSegment(segment: AudioSegment): Promise<void> {
    return new Promise((resolve) => {
      this.pauseTimeout = window.setTimeout(resolve, (segment.duration || 1) * 1000);
    });
  }
  
  // Play text segment with ElevenLabs or TTS
  private async playTextSegment(segment: AudioSegment): Promise<void> {
    // Try ElevenLabs first if API key is available
    if (this.config.elevenLabsApiKey && this.config.elevenLabsApiKey.trim()) {
      try {
        console.log('🎤 Attempting ElevenLabs generation...');
        console.log('API Key present:', this.config.elevenLabsApiKey.substring(0, 10) + '...');
        console.log('Voice ID:', this.config.voiceId);
        console.log('Text length:', segment.content.length);
        
        const audioUrl = await this.generateElevenLabsAudio(segment.content);
        console.log('✅ ElevenLabs audio URL generated:', audioUrl.substring(0, 50) + '...');
        return await this.playAudioUrl(audioUrl);
      } catch (error) {
        console.error('❌ ElevenLabs failed:', error);
        console.log('⚠️ Falling back to browser TTS');
      }
    } else {
      console.log('ℹ️ No ElevenLabs API key, using browser TTS');
    }
    
    // Fallback to browser TTS
    return await this.playWithTTS(segment.content);
  }
  
  // Generate audio using ElevenLabs
  private async generateElevenLabsAudio(text: string): Promise<string> {
    // Check cache first
    const cacheKey = `elevenlabs_${btoa(text).slice(0, 20)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.log('📦 Using cached audio');
      return cached;
    }
    
    console.log('🔄 Generating new audio from ElevenLabs...');
    console.log('Text preview:', text.substring(0, 100) + '...');
    
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId}`;
    console.log('API URL:', url);
    
    const requestBody = {
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': this.config.elevenLabsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }
      
      const blob = await response.blob();
      console.log('✅ Audio blob received, size:', blob.size, 'bytes');
      
      const audioUrl = URL.createObjectURL(blob);
      console.log('✅ Audio URL created:', audioUrl);
      
      // Cache for future use
      try {
        localStorage.setItem(cacheKey, audioUrl);
        console.log('💾 Audio cached successfully');
      } catch (e) {
        console.warn('⚠️ Could not cache audio (localStorage full?):', e);
      }
      
      return audioUrl;
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
  }
  
  // Play audio URL with ducking
  private async playAudioUrl(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.voiceAudio = new Audio(audioUrl);
      this.voiceAudio.volume = this.config.voiceVolume;
      
      // Duck background music when voice starts
      this.voiceAudio.onplay = () => {
        this.startDucking();
      };
      
      // Restore music when voice ends
      this.voiceAudio.onended = () => {
        this.stopDucking();
        resolve();
      };
      
      this.voiceAudio.onerror = () => {
        this.stopDucking();
        reject(new Error('Audio playback failed'));
      };
      
      this.voiceAudio.play().catch(reject);
    });
  }
  
  // Play with browser TTS
  private async playWithTTS(text: string): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find Telugu voice
      const voices = window.speechSynthesis.getVoices();
      const teluguVoice = voices.find(voice => 
        voice.lang.includes('te') || voice.lang.includes('hi') || voice.lang.includes('ta')
      );
      
      if (teluguVoice) {
        utterance.voice = teluguVoice;
      }
      
      utterance.rate = 0.85;
      utterance.volume = this.config.voiceVolume;
      utterance.pitch = 1.0;
      
      // Duck music during speech
      utterance.onstart = () => this.startDucking();
      utterance.onend = () => {
        this.stopDucking();
        resolve();
      };
      utterance.onerror = () => {
        this.stopDucking();
        resolve();
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }
  
  // Start audio ducking (lower music during speech)
  private startDucking() {
    if (!this.musicAudio || this.isDucking) return;
    
    this.isDucking = true;
    const targetVolume = this.config.musicVolume * this.config.duckingLevel;
    this.fadeVolume(this.musicAudio, this.musicAudio.volume, targetVolume, 500);
  }
  
  // Stop audio ducking (restore music volume)
  private stopDucking() {
    if (!this.musicAudio || !this.isDucking) return;
    
    this.isDucking = false;
    this.fadeVolume(this.musicAudio, this.musicAudio.volume, this.config.musicVolume, 800);
  }
  
  // Smooth volume fade
  private fadeVolume(audio: HTMLAudioElement, from: number, to: number, duration: number) {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = (to - from) / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(0, Math.min(1, from + volumeStep * currentStep));
      
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);
  }
  
  // Get music file path
  private getMusicFile(musicType?: string): string | null {
    const musicFiles: Record<string, string> = {
      'intro': '/audio/music/soft-intro.mp3',
      'transition': '/audio/music/light-transition.mp3',
      'ending': '/audio/music/soft-ending.mp3',
      'fadeout': '/audio/music/fade-out.mp3',
    };
    
    return musicType ? musicFiles[musicType] : null;
  }
  
  // Pause playback
  pause() {
    this.isPaused = true;
    this.isPlaying = false;
    
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
    
    if (this.voiceAudio) {
      this.voiceAudio.pause();
    }
    
    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
    }
    
    window.speechSynthesis.pause();
  }
  
  // Resume playback
  resume() {
    this.isPaused = false;
    this.isPlaying = true;
    
    if (this.musicAudio && this.musicAudio.paused) {
      this.musicAudio.play();
    }
    
    if (this.voiceAudio && this.voiceAudio.paused) {
      this.voiceAudio.play();
    }
    
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else {
      this.playNextSegment();
    }
  }
  
  // Stop playback
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentSegmentIndex = 0;
    
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
    
    if (this.voiceAudio) {
      this.voiceAudio.pause();
      this.voiceAudio.currentTime = 0;
      this.voiceAudio = null;
    }
    
    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
      this.pauseTimeout = null;
    }
    
    if (this.duckingInterval) {
      clearInterval(this.duckingInterval);
      this.duckingInterval = null;
    }
    
    this.clearSleepTimer();
    window.speechSynthesis.cancel();
  }
  
  // Fade out and stop (for sleep timer)
  private fadeOutAndStop() {
    if (this.musicAudio) {
      this.fadeVolume(this.musicAudio, this.musicAudio.volume, 0, this.config.fadeOutDuration);
    }
    
    if (this.voiceAudio) {
      this.fadeVolume(this.voiceAudio, this.voiceAudio.volume, 0, this.config.fadeOutDuration);
    }
    
    setTimeout(() => {
      this.stop();
    }, this.config.fadeOutDuration);
  }
  
  // Get total segments
  getTotalSegments(): number {
    return this.segments.length;
  }
  
  // Get current segment
  getCurrentSegment(): number {
    return this.currentSegmentIndex;
  }
  
  // Get playing state
  getIsPlaying(): boolean {
    return this.isPlaying;
  }
  
  // Get paused state
  getIsPaused(): boolean {
    return this.isPaused;
  }
}
