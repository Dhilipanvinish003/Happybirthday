import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Wind, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBlowDetection } from '../../hooks/useBlowDetection';

export default function CandleInteraction({
  candlesBlown,
  onBlowSuccess,
  isBlowingSequence,
  setIsBlowingSequence,
}) {
  const triggerBlowOut = useCallback(() => {
    if (candlesBlown || isBlowingSequence) return;

    setIsBlowingSequence(true);

    // Rapid flicker and extinguishing phase
    setTimeout(() => {
      // Confetti burst with elegant purple and gold palette
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#C084FC', '#7C3AED', '#E9D5FF', '#FDE047'],
          disableForReducedMotion: true,
        });

        setTimeout(() => {
          confetti({
            particleCount: 30,
            angle: 60,
            spread: 55,
            origin: { x: 0.1 },
            colors: ['#C084FC', '#E9D5FF', '#A855F7'],
          });
          confetti({
            particleCount: 30,
            angle: 120,
            spread: 55,
            origin: { x: 0.9 },
            colors: ['#C084FC', '#E9D5FF', '#A855F7'],
          });
        }, 220);
      } catch {
        // Safe confetti fallback
      }

      onBlowSuccess();
    }, 1100);
  }, [candlesBlown, isBlowingSequence, onBlowSuccess, setIsBlowingSequence]);

  const {
    isListening,
    micPermission,
    micLevel,
    status,
    feedbackText,
    startListening,
    stopListening,
  } = useBlowDetection({
    onBlow: triggerBlowOut,
    enabled: !candlesBlown,
  });

  // Attempt auto-activation when arriving on the cake screen if permission not explicitly denied
  useEffect(() => {
    if (!candlesBlown && !isListening && micPermission !== 'denied' && micPermission !== 'unsupported') {
      startListening().catch(() => {});
    }
    return () => {
      if (candlesBlown) {
        stopListening();
      }
    };
  }, [candlesBlown, isListening, micPermission, startListening, stopListening]);

  return (
    <div className="w-full flex flex-col items-center mt-4 sm:mt-6 z-20">
      <AnimatePresence mode="wait">
        {!candlesBlown && !isBlowingSequence ? (
          <motion.div
            key="blow-controls"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
            className="flex flex-col items-center gap-3 text-center px-4"
          >
            {isListening ? (
              /* Microphone actively listening / calibrating / detecting blow */
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 px-5 sm:px-6 py-3 rounded-full bg-purple-950/80 border border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.45)] backdrop-blur-md">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-7 h-7 rounded-full bg-purple-500/30 animate-ping" />
                    <Mic className="w-4.5 h-4.5 text-purple-300" />
                  </div>

                  <span className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-purple-200">
                    {feedbackText}
                  </span>

                  {/* Dynamic sound visualizer */}
                  <div className="flex items-end gap-1 h-4.5 w-10 justify-center">
                    {[20, 50, 80, 45, 65].map((base, i) => (
                      <span
                        key={i}
                        className="w-1 rounded-full bg-gradient-to-t from-purple-500 to-pink-300 transition-all duration-100"
                        style={{
                          height: `${Math.max(20, Math.min(100, micLevel * 1.4 + base * 0.15))}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Real-time breath energy level bar */}
                <div className="w-44 sm:w-56 h-1.5 rounded-full bg-white/10 overflow-hidden border border-purple-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-amber-300 transition-all duration-100 ease-out"
                    style={{ width: `${Math.min(100, micLevel * 2.2)}%` }}
                  />
                </div>

                <p className="text-[11px] sm:text-xs text-purple-300/80 font-light tracking-wider uppercase">
                  {status === 'calibrating'
                    ? 'Measuring ambient room sound...'
                    : 'Blow directly toward your microphone'}
                </p>
              </div>
            ) : (
              /* Permission prompt or Fallback when permission denied/unsupported */
              <div className="flex flex-col items-center gap-3">
                {micPermission === 'denied' || micPermission === 'unsupported' ? (
                  /* Robust Fallback: Tap to blow */
                  <div className="flex flex-col items-center gap-2.5">
                    <motion.button
                      type="button"
                      onClick={triggerBlowOut}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      className="group relative px-7 sm:px-9 py-3.5 rounded-full bg-gradient-to-r from-purple-900/90 via-purple-700/80 to-purple-950/90 border border-purple-400/60 shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(192,132,252,0.8)] text-white font-medium text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md flex items-center gap-2.5"
                    >
                      <Wind className="w-4.5 h-4.5 text-purple-200" />
                      <span className="shimmer-text font-semibold">TAP TO BLOW THE CANDLES</span>
                      <Sparkles className="w-4 h-4 text-purple-300" />
                    </motion.button>
                    <p className="text-[11px] sm:text-xs text-purple-300/80 font-light tracking-wide max-w-xs">
                      Microphone access isn't available. Tap the button to blow out your candles!
                    </p>
                  </div>
                ) : (
                  /* Initial mic request button */
                  <div className="flex flex-col items-center gap-2.5">
                    <motion.button
                      type="button"
                      onClick={startListening}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      className="group relative px-7 sm:px-9 py-3.5 rounded-full bg-gradient-to-r from-purple-900/90 via-purple-700/80 to-purple-950/90 border border-purple-400/60 shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(192,132,252,0.8)] text-white font-medium text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md flex items-center gap-2.5"
                    >
                      <Mic className="w-4.5 h-4.5 text-purple-200 animate-pulse" />
                      <span className="shimmer-text">ENABLE MIC & BLOW CANDLES 🎙️</span>
                    </motion.button>
                    <p className="text-[11px] sm:text-xs text-purple-300/80 font-light tracking-wide max-w-xs">
                      Tap to enable microphone, then blow toward your screen to extinguish the flames.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : isBlowingSequence && !candlesBlown ? (
          <motion.div
            key="blowing-sequence"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2.5 text-purple-300 py-2.5 px-6 rounded-full glass-panel border border-purple-400/30"
          >
            <Wind className="w-4.5 h-4.5 text-purple-200 animate-spin" style={{ animationDuration: '2.5s' }} />
            <span className="text-xs sm:text-sm uppercase tracking-widest text-purple-200">
              Extinguishing the flames...
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="wished"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="text-center py-2 px-6 rounded-full bg-purple-950/60 border border-purple-400/50 shadow-[0_0_35px_rgba(192,132,252,0.5)] backdrop-blur-xl"
          >
            <span className="text-xs sm:text-sm md:text-base font-cinzel tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-300">
              ✨ Wish Granted ✨
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
