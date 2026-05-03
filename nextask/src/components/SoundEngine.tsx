import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { useTaskStore } from '../stores/useTaskStore';

export const SoundEngine = () => {
  const { soundEnabled, rageMode } = useAppStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const droneOscillatorsRef = useRef<OscillatorNode[]>([]);
  const melodyOscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const distortionNodeRef = useRef<WaveShaperNode | null>(null);
  const bpmRef = useRef(45); // Start with slower, more peaceful tempo
  const melodyIntervalRef = useRef<number | null>(null);
  const previousCompletedCountRef = useRef(0);
  
  const { tasks } = useTaskStore();
  
  useEffect(() => {
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    
    if (completedCount > previousCompletedCountRef.current) {
      bpmRef.current = Math.min(65, bpmRef.current + 5); // Slower progression for peaceful music
    }
    
    previousCompletedCountRef.current = completedCount;
  }, [tasks]);
  
  useEffect(() => {
    if (rageMode) {
      bpmRef.current = 140;
      if (distortionNodeRef.current && filterNodeRef.current) {
        distortionNodeRef.current.curve = makeDistortionCurve(400);
        filterNodeRef.current.frequency.value = 800;
      }
    } else {
      if (distortionNodeRef.current && filterNodeRef.current) {
        distortionNodeRef.current.curve = makeDistortionCurve(0);
        filterNodeRef.current.frequency.value = 400;
      }
    }
  }, [rageMode]);
  
  useEffect(() => {
    if (soundEnabled) {
      startAudio();
    } else {
      stopAudio();
    }
    
    return () => {
      stopAudio();
    };
  }, [soundEnabled]);
  
  const makeDistortionCurve = (amount: number) => {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    
    return curve;
  };
  
  const startAudio = () => {
    if (audioContextRef.current) return;
    
    const ctx = new AudioContext();
    audioContextRef.current = ctx;
    
    // Create nodes
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.08; // Softer volume for peaceful ambience
    gainNodeRef.current = gainNode;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800; // Brighter, more pleasant tone
    filter.Q.value = 0.5;
    filterNodeRef.current = filter;
    
    const distortion = ctx.createWaveShaper();
    distortion.curve = makeDistortionCurve(0);
    distortionNodeRef.current = distortion;
    
    // Create reverb for spacious sound
    const convolver = ctx.createConvolver();
    const reverbLength = ctx.sampleRate * 2;
    const reverbBuffer = ctx.createBuffer(2, reverbLength, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const channelData = reverbBuffer.getChannelData(channel);
      for (let i = 0; i < reverbLength; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLength, 2);
      }
    }
    convolver.buffer = reverbBuffer;
    
    // Create peaceful drone chord (C major 7: C, E, G, B)
    // Using lower octave for calming effect
    const frequencies = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.12;
      
      // Slow fade in for each note
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2 + index * 0.5);
      
      osc.connect(oscGain);
      oscGain.connect(convolver);
      oscGain.connect(filter);
      osc.start();
      
      droneOscillatorsRef.current.push(osc);
    });
    
    // Create gentle melody oscillator
    const melodyOsc = ctx.createOscillator();
    melodyOsc.type = 'sine'; // Pure sine for peaceful tone
    melodyOsc.frequency.value = 523.25;
    
    const melodyGain = ctx.createGain();
    melodyGain.gain.value = 0;
    
    melodyOsc.connect(melodyGain);
    melodyGain.connect(convolver);
    melodyGain.connect(filter);
    melodyOsc.start();
    
    melodyOscillatorRef.current = melodyOsc;
    
    // Connect chain
    convolver.connect(gainNode);
    filter.connect(distortion);
    distortion.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Peaceful melody notes (Pentatonic scale for pleasant sound)
    // C, D, E, G, A - no dissonant intervals
    const melodyNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33];
    let noteIndex = 0;
    
    const playMelodyNote = () => {
      if (!melodyOscillatorRef.current || !audioContextRef.current) return;
      
      const now = audioContextRef.current.currentTime;
      melodyOsc.frequency.setValueAtTime(melodyNotes[noteIndex], now);
      melodyGain.gain.cancelScheduledValues(now);
      melodyGain.gain.setValueAtTime(0, now);
      melodyGain.gain.linearRampToValueAtTime(0.06, now + 0.1); // Gentle attack
      melodyGain.gain.linearRampToValueAtTime(0.04, now + 0.5); // Sustain
      melodyGain.gain.linearRampToValueAtTime(0, now + 1.2); // Long release
      
      noteIndex = (noteIndex + 1) % melodyNotes.length;
    };
    
    const updateMelodyInterval = () => {
      if (melodyIntervalRef.current) {
        clearInterval(melodyIntervalRef.current);
      }
      
      // Slower tempo for peaceful ambience (40-60 BPM)
      const peacefulBPM = rageMode ? bpmRef.current : Math.min(60, 40 + (bpmRef.current - 60) * 0.3);
      const interval = (60 / peacefulBPM) * 1000 * 2; // Double the interval for more space
      melodyIntervalRef.current = window.setInterval(playMelodyNote, interval);
    };
    
    // Start melody after 3 seconds
    setTimeout(() => {
      updateMelodyInterval();
    }, 3000);
    
    // Update BPM periodically
    const bpmUpdateInterval = setInterval(() => {
      updateMelodyInterval();
    }, 5000);
    
    return () => {
      clearInterval(bpmUpdateInterval);
    };
  };
  
  const stopAudio = () => {
    if (melodyIntervalRef.current) {
      clearInterval(melodyIntervalRef.current);
      melodyIntervalRef.current = null;
    }
    
    droneOscillatorsRef.current.forEach(osc => {
      osc.stop();
      osc.disconnect();
    });
    droneOscillatorsRef.current = [];
    
    if (melodyOscillatorRef.current) {
      melodyOscillatorRef.current.stop();
      melodyOscillatorRef.current.disconnect();
      melodyOscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };
  
  return null;
};
