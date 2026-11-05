import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Procedural Indian Classical Tanpura / Meditation Drone using Web Audio API
 * Generates peaceful Sa-Pa-Sa harmonics (C#3 fundamental ~138.59 Hz)
 */
class TanpuraSynth {
  constructor() {
    this.ctx = null;
    this.oscillators = [];
    this.gainNode = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start() {
    this.init();
    if (this.isPlaying) return;

    const baseFreq = 138.59; // C#3 (Traditional Indian Classical pitch)
    // Harmonics: Fundamental (Sa), Fifth (Pa), Octave (High Sa), Tenth (Ga)
    const notes = [
      { freq: baseFreq * 0.75, type: 'sine', gain: 0.12 }, // Low Pa
      { freq: baseFreq, type: 'triangle', gain: 0.15 },    // Sa fundamental
      { freq: baseFreq * 1.5, type: 'sine', gain: 0.08 },  // Pa fifth
      { freq: baseFreq * 2.0, type: 'sine', gain: 0.05 },  // High Sa
      { freq: baseFreq * 2.5, type: 'triangle', gain: 0.03 } // Ga
    ];

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 3);

    // Warm low-pass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    this.gainNode.connect(filter);
    filter.connect(this.ctx.destination);

    this.oscillators = notes.map(({ freq, type, gain }) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle LFO modulation for organic acoustic warmth
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.2 + Math.random() * 0.3;
      lfoGain.gain.value = 0.8;
      lfo.connect(osc.frequency);
      lfo.start();

      oscGain.gain.value = gain;
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start();
      return { osc, lfo };
    });

    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying || !this.gainNode || !this.ctx) return;
    try {
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);
      setTimeout(() => {
        this.oscillators.forEach(({ osc, lfo }) => {
          try {
            osc.stop();
            lfo.stop();
            osc.disconnect();
            lfo.disconnect();
          } catch {}
        });
        this.oscillators = [];
        this.isPlaying = false;
      }, 1600);
    } catch {
      this.isPlaying = false;
    }
  }

  setMuted(muted) {
    if (!this.gainNode || !this.ctx) return;
    this.gainNode.gain.setValueAtTime(muted ? 0 : 0.35, this.ctx.currentTime);
  }
}

export function useAudio(src) {
  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    synthRef.current = new TanpuraSynth();
    if (src) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0.35;
      audio.preload = 'metadata';
      audioRef.current = audio;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, [src]);

  const play = useCallback(() => {
    setUserInteracted(true);
    if (audioRef.current && src) {
      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Fallback to Web Audio tanpura synth
          synthRef.current?.start();
          setPlaying(true);
        });
    } else {
      synthRef.current?.start();
      setPlaying(true);
    }
  }, [src]);

  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    synthRef.current?.stop();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) pause(); else play();
  }, [playing, play, pause]);

  const toggleMute = useCallback(() => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (audioRef.current) audioRef.current.muted = nextMuted;
    synthRef.current?.setMuted(nextMuted);
  }, [muted]);

  return { playing, muted, ready, userInteracted, play, pause, toggle, toggleMute };
}
