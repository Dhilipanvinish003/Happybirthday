import { useState, useEffect, useRef, useCallback } from 'react';

export function useBlowDetection({ onBlow, enabled = true, threshold = 48 }) {
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'unsupported'
  const [micLevel, setMicLevel] = useState(0);


  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const blowCountRef = useRef(0);
  const hasTriggeredRef = useRef(false);

  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    if (!enabled) return false;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicPermission('unsupported');
      return false;
    }

    try {
      cleanupAudio();
      hasTriggeredRef.current = false;
      blowCountRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      mediaStreamRef.current = stream;
      setMicPermission('granted');

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;

      const microphone = ctx.createMediaStreamSource(stream);
      microphone.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsListening(true);

      const checkAudio = () => {
        if (!analyserRef.current || hasTriggeredRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        // Focus on mid-to-high frequencies typical of blowing (wind noise across diaphragm)
        for (let i = 8; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / (bufferLength - 8);
        setMicLevel(Math.min(100, Math.round((average / 128) * 100)));

        // Blowing detection: continuous elevated noise across consecutive frames
        if (average > threshold) {
          blowCountRef.current += 1;
          if (blowCountRef.current >= 4 && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            if (onBlow) {
              onBlow();
            }
            cleanupAudio();
            return;
          }
        } else {
          blowCountRef.current = Math.max(0, blowCountRef.current - 1);
        }

        animationFrameRef.current = requestAnimationFrame(checkAudio);
      };

      animationFrameRef.current = requestAnimationFrame(checkAudio);
      return true;
    } catch (err) {
      console.warn("Microphone access denied or error:", err);
      setMicPermission('denied');
      cleanupAudio();
      return false;
    }
  }, [cleanupAudio, enabled, onBlow, threshold]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    isListening,
    micPermission,
    micLevel,
    startListening,
    stopListening: cleanupAudio,
  };
}
