import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Advanced Microphone Blow Sound Detection Hook
 * Uses Web Audio API spectral analysis to distinguish genuine airflow/breath
 * blowing from speech, laughter, music, background room noise, and sudden impulses.
 */
export function useBlowDetection({ onBlow, enabled = true }) {
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'unsupported'
  const [micLevel, setMicLevel] = useState(0); // 0-100 visual level
  const [status, setStatus] = useState('idle'); // 'idle' | 'calibrating' | 'listening' | 'almost' | 'success' | 'denied' | 'unsupported'
  const [feedbackText, setFeedbackText] = useState('Blow toward the candles...');

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  // Calibration and detection state refs (avoid React re-renders in RAF)
  const calibrationFramesRef = useRef([]);
  const isCalibratedRef = useRef(false);
  const noiseFloorRef = useRef({
    avgRms: 12,
    avgAirflowEnergy: 10,
    peakNoise: 20,
  });

  const blowDurationRef = useRef(0); // Time in ms meeting blow criteria
  const lastFrameTimeRef = useRef(0);
  const statusRef = useRef('idle');

  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
    setIsListening(false);
    statusRef.current = 'idle';
  }, []);

  const startListening = useCallback(async () => {
    if (!enabled || hasTriggeredRef.current) return false;
    if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
      setMicPermission('unsupported');
      setStatus('unsupported');
      setFeedbackText("Microphone access isn't available.");
      return false;
    }

    try {
      cleanupAudio();
      hasTriggeredRef.current = false;
      calibrationFramesRef.current = [];
      isCalibratedRef.current = false;
      blowDurationRef.current = 0;

      // 1. Microphone request with speech-filtering & cancellation constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      setMicPermission('granted');

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }
      audioContextRef.current = ctx;

      // 2. High-resolution AnalyserNode
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024; // 512 frequency bins (~43-47 Hz per bin)
      analyser.smoothingTimeConstant = 0.25; // responsive yet smooth
      analyserRef.current = analyser;

      const microphone = ctx.createMediaStreamSource(stream);
      microphone.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const freqData = new Uint8Array(bufferLength);
      const timeData = new Uint8Array(bufferLength);

      setIsListening(true);
      setStatus('calibrating');
      statusRef.current = 'calibrating';
      setFeedbackText('Get ready...');

      const calibrationStartTime = performance.now();
      const CALIBRATION_DURATION_MS = 1400; // 1.4 seconds environment calibration

      lastFrameTimeRef.current = performance.now();

      // UI throttle counter for level updates (avoid React 60 FPS re-renders)
      let uiUpdateCounter = 0;

      const processAudio = () => {
        if (!analyserRef.current || hasTriggeredRef.current) return;

        const now = performance.now();
        const dt = Math.min((now - lastFrameTimeRef.current) / 1000, 0.1); // in seconds
        lastFrameTimeRef.current = now;

        analyserRef.current.getByteFrequencyData(freqData);
        analyserRef.current.getByteTimeDomainData(timeData);

        // Calculate overall RMS volume from time domain
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = (timeData[i] - 128) / 128;
          sumSquares += val * val;
        }
        const rms = Math.sqrt(sumSquares / bufferLength) * 100;

        // Band analysis:
        // Bin 0-5: Sub-bass & direct capsule wind turbulence (< 230Hz)
        // Bin 6-35: Human voice fundamentals & formants (250Hz - 1600Hz)
        // Bin 40-140: Broadband airflow & breath friction (1800Hz - 6500Hz)
        // Bin 140-300: High frequency noise (6500Hz - 14000Hz)

        // 1. Airflow friction energy (1800Hz - 6500Hz)
        let airflowSum = 0;
        let airflowCount = 0;
        for (let i = 40; i <= 140; i++) {
          airflowSum += freqData[i];
          airflowCount++;
        }
        const avgAirflow = airflowCount > 0 ? airflowSum / airflowCount : 0;

        // 2. Direct capsule turbulence (bins 1-5, mechanical breath puffs)
        let lowTurbulenceSum = 0;
        for (let i = 1; i <= 5; i++) {
          lowTurbulenceSum += freqData[i];
        }
        const avgLowTurbulence = lowTurbulenceSum / 5;

        // 3. Human speech / vocal band energy (bins 6-35)
        let vocalSum = 0;
        let maxVocalBin = 0;
        for (let i = 6; i <= 35; i++) {
          vocalSum += freqData[i];
          if (freqData[i] > maxVocalBin) {
            maxVocalBin = freqData[i];
          }
        }
        const avgVocal = vocalSum / 30;

        // 4. Spectral Flatness / Peakiness (Crest factor in speech band)
        // Speech and music have sharp discrete harmonic peaks (high crest factor).
        // Blowing has diffuse, broadband noise (low crest factor, flat spectrum).
        const vocalCrestFactor = avgVocal > 2 ? maxVocalBin / avgVocal : 1;

        // 5. High-frequency broad coverage (percentage of active bins in airflow range)
        let activeAirBins = 0;
        for (let i = 40; i <= 140; i++) {
          if (freqData[i] > 18) activeAirBins++;
        }
        const airflowSpreadRatio = activeAirBins / airflowCount; // 0 to 1

        // =========================================================
        // CALIBRATION PHASE
        // =========================================================
        if (!isCalibratedRef.current) {
          calibrationFramesRef.current.push({
            rms,
            airflow: avgAirflow,
            vocal: avgVocal,
          });

          if (now - calibrationStartTime >= CALIBRATION_DURATION_MS) {
            // Compute baseline noise floor
            const frames = calibrationFramesRef.current;
            const avgBaselineRms = frames.reduce((acc, f) => acc + f.rms, 0) / frames.length;
            const avgBaselineAirflow = frames.reduce((acc, f) => acc + f.airflow, 0) / frames.length;
            const peakBaseline = frames.reduce((acc, f) => Math.max(acc, f.rms), 0);

            noiseFloorRef.current = {
              avgRms: Math.max(2, avgBaselineRms),
              avgAirflowEnergy: Math.max(3, avgBaselineAirflow),
              peakNoise: Math.max(4, peakBaseline),
            };

            isCalibratedRef.current = true;
            setStatus('listening');
            statusRef.current = 'listening';
            setFeedbackText('Blow toward the candles...');
          }

          // Throttle visual level updates
          uiUpdateCounter++;
          if (uiUpdateCounter % 4 === 0) {
            setMicLevel(Math.min(100, Math.round(rms * 4)));
          }

          animationFrameRef.current = requestAnimationFrame(processAudio);
          return;
        }

        // =========================================================
        // BLOW DETECTION ALGORITHM
        // =========================================================
        const baseline = noiseFloorRef.current;

        // Confidence scoring:
        let confidence = 0;

        // Criterion A: Elevation above baseline noise floor
        const rmsAboveBaseline = rms - baseline.avgRms;
        const airflowAboveBaseline = avgAirflow - baseline.avgAirflowEnergy;

        if (airflowAboveBaseline > 12) {
          confidence += 25;
        } else if (airflowAboveBaseline > 6) {
          confidence += 15;
        }

        // Criterion B: High-frequency airflow energy presence
        if (avgAirflow > 24) {
          confidence += 20;
        }

        // Criterion C: Direct microphone capsule turbulence (< 200Hz)
        if (avgLowTurbulence > 35) {
          confidence += 20;
        }

        // Criterion D: Broadband distribution (white/pink noise spread)
        if (airflowSpreadRatio > 0.45) {
          confidence += 25;
        } else if (airflowSpreadRatio > 0.3) {
          confidence += 12;
        }

        // CRITICAL: FALSE POSITIVE PROTECTIONS (Speech / Music / Laugh / Impulses)
        // 1. Tonal speech rejection: if speech band has a sharp harmonic peak
        if (vocalCrestFactor > 3.4 && avgVocal > 25) {
          // Sharp vocal formant detected (talking, singing, or laughing)
          confidence = Math.max(0, confidence - 55);
        }

        // 2. Vocal dominance: if speech band dominates airflow band significantly
        if (avgVocal > 30 && avgVocal > avgAirflow * 1.6) {
          // Normal speaking or laughing voice
          confidence = Math.max(0, confidence - 40);
        }

        // 3. Very low volume (room background)
        if (rms < baseline.peakNoise + 2 && airflowAboveBaseline < 8) {
          confidence = 0;
        }

        // Temporal persistence:
        // Genuine blowing requires sustained airflow for approximately 280ms - 550ms.
        // Quick noises, claps, laughs, or notification dings will NOT sustain confidence.
        if (confidence >= 55) {
          blowDurationRef.current += dt * 1000; // ms

          // Transition feedback states
          if (blowDurationRef.current >= 150 && statusRef.current !== 'almost') {
            setStatus('almost');
            statusRef.current = 'almost';
            setFeedbackText('Almost...');
          }

          // Confirmed blow duration reached (320ms of sustained airflow)
          if (blowDurationRef.current >= 320 && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            setStatus('success');
            statusRef.current = 'success';
            setFeedbackText('✨ You did it.');

            if (onBlow) {
              onBlow();
            }

            // Immediately stop microphone to preserve performance & privacy
            cleanupAudio();
            return;
          }
        } else {
          // Decay blow duration smoothly
          blowDurationRef.current = Math.max(0, blowDurationRef.current - dt * 1600);
          if (blowDurationRef.current < 80 && statusRef.current === 'almost') {
            setStatus('listening');
            statusRef.current = 'listening';
            setFeedbackText('Blow toward the candles...');
          }
        }

        // Throttle UI mic level updates (15 FPS instead of 60 FPS to prevent re-render lagging)
        uiUpdateCounter++;
        if (uiUpdateCounter % 4 === 0) {
          const visualLevel = Math.min(
            100,
            Math.round(Math.max(avgAirflow * 1.5, rmsAboveBaseline * 3.5))
          );
          setMicLevel(visualLevel);
        }

        animationFrameRef.current = requestAnimationFrame(processAudio);
      };

      animationFrameRef.current = requestAnimationFrame(processAudio);
      return true;
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err);
      setMicPermission('denied');
      setStatus('denied');
      setFeedbackText("Microphone access isn't available.");
      cleanupAudio();
      return false;
    }
  }, [cleanupAudio, enabled, onBlow]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    isListening,
    micPermission,
    micLevel,
    status,
    feedbackText,
    startListening,
    stopListening: cleanupAudio,
  };
}
