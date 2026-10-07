import { useState, useEffect, useRef, useCallback } from 'react';

// Melodic notes for dreamy ambient "Happy Birthday" in gentle piano/chimes
const MELODY = [
  { note: 261.63, dur: 0.6 }, // C4
  { note: 261.63, dur: 0.4 }, // C4
  { note: 293.66, dur: 0.8 }, // D4
  { note: 261.63, dur: 0.8 }, // C4
  { note: 349.23, dur: 0.8 }, // F4
  { note: 329.63, dur: 1.4 }, // E4

  { note: 261.63, dur: 0.6 }, // C4
  { note: 261.63, dur: 0.4 }, // C4
  { note: 293.66, dur: 0.8 }, // D4
  { note: 261.63, dur: 0.8 }, // C4
  { note: 392.00, dur: 0.8 }, // G4
  { note: 349.23, dur: 1.4 }, // F4

  { note: 261.63, dur: 0.6 }, // C4
  { note: 261.63, dur: 0.4 }, // C4
  { note: 523.25, dur: 0.8 }, // C5
  { note: 440.00, dur: 0.8 }, // A4
  { note: 349.23, dur: 0.8 }, // F4
  { note: 329.63, dur: 0.8 }, // E4
  { note: 293.66, dur: 1.2 }, // D4

  { note: 466.16, dur: 0.6 }, // Bb4
  { note: 466.16, dur: 0.4 }, // Bb4
  { note: 440.00, dur: 0.8 }, // A4
  { note: 349.23, dur: 0.8 }, // F4
  { note: 392.00, dur: 0.8 }, // G4
  { note: 349.23, dur: 2.0 }, // F4
];

export function useBirthdayAudio(audioSrc = '/assets/birthday-music.mp3') {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState([30, 60, 45, 80]);

  const audioElementRef = useRef(null);
  const synthCtxRef = useRef(null);
  const synthTimerRef = useRef(null);
  const isUsingSynthRef = useRef(false);


  // Play ambient synthesized chime note
  const playSynthNote = useCallback((freq, duration, ctx) => {
    if (!ctx || ctx.state === 'closed') return;
    try {
      const now = ctx.currentTime;
      
      // Main chime tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Subtle harmonic overtone for glass/celesta chime feel
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2.005, now);

      // Soft envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 1.2);

      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.linearRampToValueAtTime(0.03, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.8);

      // Low pass filter to keep it warm and romantic
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(filter);
      gain2.connect(filter);
      filter.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + duration + 1.4);
      osc2.stop(now + duration + 1.0);
    } catch (e) {
      console.warn("Synth audio note error:", e);
    }
  }, []);

  // Ambient synthesizer loop
  const startSynthMelody = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!synthCtxRef.current) {
        synthCtxRef.current = new AudioCtx();
      }
      if (synthCtxRef.current.state === 'suspended') {
        synthCtxRef.current.resume();
      }

      isUsingSynthRef.current = true;
      let noteIndex = 0;

      const scheduleNext = () => {
        if (!isUsingSynthRef.current) return;
        const current = MELODY[noteIndex];
        playSynthNote(current.note, current.dur, synthCtxRef.current);

        const tempoScale = 900; // gentle slow romantic tempo
        const delay = current.dur * tempoScale;

        noteIndex = (noteIndex + 1) % MELODY.length;
        // Pause at loop end
        const nextDelay = noteIndex === 0 ? delay + 2000 : delay;
        synthTimerRef.current = setTimeout(scheduleNext, nextDelay);
      };

      scheduleNext();
    } catch (e) {
      console.warn("Could not start synth audio:", e);
    }
  }, [playSynthNote]);

  const stopSynthMelody = useCallback(() => {
    isUsingSynthRef.current = false;
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (synthCtxRef.current && synthCtxRef.current.state === 'running') {
      synthCtxRef.current.suspend().catch(() => {});
    }
  }, []);

  // Start visualizer animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setVisualizerBars([
        Math.floor(25 + Math.random() * 65),
        Math.floor(40 + Math.random() * 55),
        Math.floor(20 + Math.random() * 75),
        Math.floor(35 + Math.random() * 60),
      ]);
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Audio start trigger on user interaction
  const startAudio = useCallback(() => {
    setHasStarted(true);

    // Try HTML5 Audio first
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.55;
    audioElementRef.current = audio;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If file not found or browser blocks audio file loading, fall back gracefully to our dreamy synthesizer!
          console.info("Using dreamy ambient synthesizer for birthday melody.");
          startSynthMelody();
          setIsPlaying(true);
        });
    } else {
      startSynthMelody();
      setIsPlaying(true);
    }
  }, [audioSrc, startSynthMelody]);

  const togglePlay = useCallback(() => {
    if (!hasStarted) {
      startAudio();
      return;
    }

    if (isPlaying) {
      if (audioElementRef.current && !audioElementRef.current.paused) {
        audioElementRef.current.pause();
      }
      stopSynthMelody();
      setIsPlaying(false);
    } else {
      if (audioElementRef.current && audioElementRef.current.src) {
        audioElementRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          startSynthMelody();
          setIsPlaying(true);
        });
      } else {
        startSynthMelody();
        setIsPlaying(true);
      }
    }
  }, [hasStarted, isPlaying, startAudio, startSynthMelody, stopSynthMelody]);

  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      stopSynthMelody();
    };
  }, [stopSynthMelody]);

  return {
    isPlaying,
    hasStarted,
    startAudio,
    togglePlay,
    visualizerBars,
  };
}
