import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBlowDetection } from '../../hooks/useBlowDetection';

export default function CandleInteraction({
  candlesBlown,
  onBlowSuccess,
  isBlowingSequence,
  setIsBlowingSequence
}) {
  const triggerBlowOut = () => {
    if (candlesBlown || isBlowingSequence) return;

    setIsBlowingSequence(true);

    // Rapid flicker phase
    setTimeout(() => {
      // Confetti burst with elegant purple and gold palette
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#C084FC', '#7C3AED', '#E9D5FF', '#FDE047'],
        disableForReducedMotion: true,
      });

      // Secondary soft shower
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#C084FC', '#E9D5FF', '#A855F7'],
        });
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#C084FC', '#E9D5FF', '#A855F7'],
        });
      }, 250);

      onBlowSuccess();
    }, 1200);
  };

  const {
    isListening,
    micPermission,
    micLevel,
    startListening,
    stopListening
  } = useBlowDetection({
    onBlow: triggerBlowOut,
    enabled: !candlesBlown,
    threshold: 34
  });

  // Attempt auto-activation when arriving on the cake screen
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
    <div className="w-full flex flex-col items-center mt-6 z-20">
      <AnimatePresence mode="wait">
        {!candlesBlown && !isBlowingSequence ? (
          <motion.div
            key="blow-controls"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-3 text-center px-4"
          >
            {isListening ? (
              /* Microphone actively listening for blow sound */
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-purple-950/80 border border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.45)] backdrop-blur-md">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-purple-500/30 animate-ping" />
                    <Mic className="w-5 h-5 text-purple-300" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-purple-200 animate-pulse">
                    BLOW INTO YOUR MIC NOW 🌬️
                  </span>
                  {/* Dynamic sound visualizer */}
                  <div className="flex items-end gap-1 h-5 w-12 justify-center">
                    {[20, 50, 80, 45, 65].map((base, i) => (
                      <span
                        key={i}
                        className="w-1.5 rounded-full bg-gradient-to-t from-purple-500 to-pink-300 transition-all duration-100"
                        style={{
                          height: `${Math.max(15, Math.min(100, (micLevel * 1.5) + (base * 0.2)))}%`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Real-time breath level indicator */}
                <div className="w-48 sm:w-60 h-1.5 rounded-full bg-white/10 overflow-hidden border border-purple-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-amber-300 transition-all duration-100 ease-out"
                    style={{ width: `${Math.min(100, micLevel * 2.2)}%` }}
                  />
                </div>

                <p className="text-xs text-purple-300/80 font-light tracking-wider uppercase">
                  Blow directly on your microphone to extinguish the candles
                </p>
              </div>
            ) : (
              /* Prompt user to grant/activate microphone if required by browser */
              <div className="flex flex-col items-center gap-3">
                <motion.button
                  type="button"
                  onClick={startListening}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative px-7 sm:px-9 py-4 rounded-full bg-gradient-to-r from-purple-900/90 via-purple-700/80 to-purple-950/90 border border-purple-400/60 shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(192,132,252,0.8)] text-white font-medium text-sm sm:text-base tracking-widest uppercase transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md flex items-center gap-3"
                >
                  <Mic className="w-5 h-5 text-purple-200 animate-pulse" />
                  <span className="shimmer-text">
                    {micPermission === 'denied' ? 'ALLOW MIC TO BLOW CANDLES' : 'ENABLE MIC & BLOW CANDLES 🎙️'}
                  </span>
                </motion.button>
                <p className="text-xs sm:text-sm text-purple-300/80 font-light tracking-wide max-w-sm">
                  {micPermission === 'denied'
                    ? 'Microphone permission needed. Please allow microphone in your browser to blow out the candles.'
                    : 'Tap to enable microphone, then blow directly into your device to extinguish the flames.'}
                </p>
              </div>
            )}
          </motion.div>
        ) : isBlowingSequence && !candlesBlown ? (
          <motion.div
            key="blowing-sequence"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-purple-300 py-3 px-6 rounded-full glass-panel border border-purple-400/30"
          >
            <Wind className="w-5 h-5 text-purple-200 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-sm uppercase tracking-widest text-purple-200">
              Extinguishing the flames...
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="wished"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="text-center py-2 px-6 rounded-full bg-purple-950/60 border border-purple-400/50 shadow-[0_0_35px_rgba(192,132,252,0.5)] backdrop-blur-xl"
          >
            <span className="text-sm sm:text-base font-cinzel tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-300">
              ✨ Wish Granted ✨
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
