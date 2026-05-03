// Story Audio Parser - Handles music cues and pauses in story content

export interface AudioSegment {
  type: 'text' | 'music' | 'pause';
  content: string;
  duration?: number; // in seconds
  musicType?: 'intro' | 'transition' | 'ending' | 'fadeout';
}

/**
 * Parse story content and extract audio segments
 * Handles: 🎵 [music cues] and 🎧 (pause Xs)
 */
export function parseStoryContent(content: string): AudioSegment[] {
  const segments: AudioSegment[] = [];
  
  // Split by lines and process each
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) continue;
    
    // Check for music cue: 🎵 [Soft intro music]
    const musicMatch = trimmedLine.match(/🎵\s*\[(.*?)\]/);
    if (musicMatch) {
      const musicDesc = musicMatch[1].toLowerCase();
      let musicType: AudioSegment['musicType'] = 'intro';
      
      if (musicDesc.includes('intro')) musicType = 'intro';
      else if (musicDesc.includes('transition')) musicType = 'transition';
      else if (musicDesc.includes('ending')) musicType = 'ending';
      else if (musicDesc.includes('fade')) musicType = 'fadeout';
      
      segments.push({
        type: 'music',
        content: musicMatch[1],
        duration: musicType === 'fadeout' ? 2 : musicType === 'intro' ? 3 : 1.5,
        musicType
      });
      continue;
    }
    
    // Check for pause cue: 🎧 (pause 1s)
    const pauseMatch = trimmedLine.match(/🎧\s*\(pause\s+(\d+)s\)/);
    if (pauseMatch) {
      const pauseDuration = parseInt(pauseMatch[1]);
      segments.push({
        type: 'pause',
        content: `Pause ${pauseDuration}s`,
        duration: pauseDuration
      });
      continue;
    }
    
    // Check for moral section
    if (trimmedLine.startsWith('మారల్:') || trimmedLine.startsWith('Moral:')) {
      segments.push({
        type: 'text',
        content: trimmedLine
      });
      continue;
    }
    
    // Regular text content
    if (trimmedLine && !trimmedLine.startsWith('🎵') && !trimmedLine.startsWith('🎧')) {
      segments.push({
        type: 'text',
        content: trimmedLine
      });
    }
  }
  
  return segments;
}

/**
 * Play story with music and pauses
 */
export class StoryAudioPlayer {
  private segments: AudioSegment[];
  private currentSegmentIndex: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private musicAudio: HTMLAudioElement | null = null;
  private speechSynthesis: SpeechSynthesisUtterance | null = null;
  private onProgressCallback?: (progress: number, total: number) => void;
  private onEndCallback?: () => void;
  private pauseTimeout: number | null = null;
  private volume: number = 1;
  private speechRate: number = 0.85;
  
  constructor(content: string) {
    this.segments = parseStoryContent(content);
  }
  
  setVolume(volume: number) {
    this.volume = volume;
    if (this.musicAudio) {
      this.musicAudio.volume = volume * 0.3; // Music at 30% of main volume
    }
    if (this.speechSynthesis) {
      this.speechSynthesis.volume = volume;
    }
  }
  
  setSpeechRate(rate: number) {
    this.speechRate = rate;
  }
  
  onProgress(callback: (progress: number, total: number) => void) {
    this.onProgressCallback = callback;
  }
  
  onEnd(callback: () => void) {
    this.onEndCallback = callback;
  }
  
  async play() {
    if (this.isPaused) {
      this.resume();
      return;
    }
    
    this.isPlaying = true;
    this.currentSegmentIndex = 0;
    await this.playNextSegment();
  }
  
  private async playNextSegment() {
    if (!this.isPlaying || this.currentSegmentIndex >= this.segments.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }
    
    const segment = this.segments[this.currentSegmentIndex];
    
    if (this.onProgressCallback) {
      this.onProgressCallback(this.currentSegmentIndex, this.segments.length);
    }
    
    switch (segment.type) {
      case 'music':
        await this.playMusic(segment);
        break;
      case 'pause':
        await this.playPause(segment);
        break;
      case 'text':
        await this.playText(segment);
        break;
    }
    
    this.currentSegmentIndex++;
    await this.playNextSegment();
  }
  
  private async playMusic(segment: AudioSegment): Promise<void> {
    return new Promise((resolve) => {
      // Try to load actual music file
      const musicFile = this.getMusicFile(segment.musicType);
      
      if (musicFile) {
        this.musicAudio = new Audio(musicFile);
        this.musicAudio.volume = this.volume * 0.3;
        
        this.musicAudio.onended = () => {
          resolve();
        };
        
        this.musicAudio.onerror = () => {
          // If music file not found, just wait for the duration
          setTimeout(resolve, (segment.duration || 2) * 1000);
        };
        
        this.musicAudio.play().catch(() => {
          setTimeout(resolve, (segment.duration || 2) * 1000);
        });
      } else {
        // No music file, just wait
        setTimeout(resolve, (segment.duration || 2) * 1000);
      }
    });
  }
  
  private async playPause(segment: AudioSegment): Promise<void> {
    return new Promise((resolve) => {
      this.pauseTimeout = window.setTimeout(resolve, (segment.duration || 1) * 1000);
    });
  }
  
  private async playText(segment: AudioSegment): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(segment.content);
      
      // Try to find Telugu or Hindi voice
      const voices = window.speechSynthesis.getVoices();
      const teluguVoice = voices.find(voice => 
        voice.lang.includes('te') || voice.lang.includes('hi') || voice.lang.includes('ta')
      );
      
      if (teluguVoice) {
        utterance.voice = teluguVoice;
      }
      
      utterance.rate = this.speechRate;
      utterance.volume = this.volume;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = () => {
        resolve();
      };
      
      this.speechSynthesis = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }
  
  private getMusicFile(musicType?: string): string | null {
    // Map music types to audio files
    const musicFiles: Record<string, string> = {
      'intro': '/audio/music/soft-intro.mp3',
      'transition': '/audio/music/light-transition.mp3',
      'ending': '/audio/music/soft-ending.mp3',
      'fadeout': '/audio/music/fade-out.mp3'
    };
    
    return musicType ? musicFiles[musicType] : null;
  }
  
  pause() {
    this.isPaused = true;
    this.isPlaying = false;
    
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
    
    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
    }
    
    window.speechSynthesis.pause();
  }
  
  resume() {
    this.isPaused = false;
    this.isPlaying = true;
    
    if (this.musicAudio && this.musicAudio.paused) {
      this.musicAudio.play();
    }
    
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else {
      // Continue from where we left off
      this.playNextSegment();
    }
  }
  
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentSegmentIndex = 0;
    
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
      this.musicAudio = null;
    }
    
    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
      this.pauseTimeout = null;
    }
    
    window.speechSynthesis.cancel();
  }
  
  getTotalSegments(): number {
    return this.segments.length;
  }
  
  getCurrentSegment(): number {
    return this.currentSegmentIndex;
  }
}
