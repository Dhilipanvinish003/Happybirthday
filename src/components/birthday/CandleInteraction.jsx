import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Wind } from 'lucide-react';
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
    threshold: 45
  });

  return (
    <div className="w-full flex flex-col items-center mt-6 z-20">
      <AnimatePresence mode="wait">
        {!candlesBlown && !isBlowingSequence ? (
          <motion.div
            key="blow-controls"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-4 text-center px-4"
          >
            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Primary Blow button */}
              <motion.button
                type="button"
                onClick={triggerBlowOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="group relative px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-900/90 via-purple-700/80 to-purple-950/90 border border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.45)] hover:shadow-[0_0_45px_rgba(192,132,252,0.7)] text-white font-medium text-sm sm:text-base tracking-widest uppercase transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2.5">
                  <Wind className="w-4 h-4 text-purple-200 group-hover:translate-x-0.5 transition-transform" />
                  <span>BLOW THE CANDLES</span>
                </span>
              </motion.button>

              {/* Microphone trigger button */}
              {micPermission !== 'unsupported' && (
                <button
                  type="button"
                  onClick={() => {
                    if (isListening) {
                      stopListening();
                    } else {
                      startListening();
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-3.5 rounded-full text-xs sm:text-sm tracking-wider uppercase border transition-all duration-300 cursor-pointer backdrop-blur-md ${
                    isListening
                      ? 'bg-purple-900/50 border-purple-400 text-purple-200 shadow-[0_0_20px_rgba(192,132,252,0.5)]'
                      : 'bg-black/40 border-purple-500/30 text-purple-300/80 hover:text-purple-100 hover:border-purple-400/50'
                  }`}
                  title={isListening ? "Listening for your breath blow..." : "Enable microphone to blow with real breath"}
                >
                  {isListening ? (
                    <>
                      <Mic className="w-4 h-4 text-purple-300 animate-pulse" />
                      <span>Mic Active ({micLevel}%)</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 text-purple-400/70" />
                      <span>Use Mic</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Helper guidance */}
            <p className="text-xs sm:text-sm text-purple-300/70 font-light tracking-wide max-w-sm">
              {isListening
                ? "Blow gently into your device microphone to extinguish the flames"
                : "Tap the button or enable microphone to blow out the candles"}
            </p>
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
