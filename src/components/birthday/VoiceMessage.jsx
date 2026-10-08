import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Headphones, ArrowRight, Heart } from 'lucide-react';

export default function VoiceMessage({ data, onNext, isPlaying, onTogglePlay, startAudio }) {
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleListen = () => {
    setHasInteracted(true);
    if (!isPlaying) {
      if (startAudio) {
        startAudio();
      } else if (onTogglePlay) {
        onTogglePlay();
      }
    }
  };

  return (
    <motion.section
      key="voice-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.4, ease: "easeOut" } }}
      className="relative min-h-[92vh] min-h-[92dvh] w-full flex flex-col items-center justify-start px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none -z-10" />

      {/* Header Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-2 mb-2"
      >
        <Sparkles className="w-4 h-4 text-purple-300" />
        <span className="text-xs uppercase tracking-[0.4em] text-purple-300/80 font-medium">
          A Voice For Your Heart
        </span>
        <Sparkles className="w-4 h-4 text-purple-300" />
      </motion.div>

      {/* Main Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-widest leading-snug uppercase mb-4 max-w-2xl"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-300">
          {data.voiceHeading || "SOME THINGS ARE BETTER HEARD THAN READ."}
        </span>
      </motion.h2>

      {/* Intro lead text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="font-cormorant italic text-lg sm:text-2xl text-purple-200/90 font-light mb-8 max-w-lg"
      >
        "{data.voiceLead || "I have something I want you to hear."}"
      </motion.p>

      {/* Sound Visualizer & Action Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.9 }}
        className="relative w-full max-w-lg p-8 sm:p-10 rounded-3xl glass-panel-glow border border-purple-400/40 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex flex-col items-center gap-6"
      >
        {/* Animated wave bars - GPU scaleY transforms without layout reflow */}
        <div className="flex items-center gap-1.5 h-16 justify-center">
          {[20, 45, 75, 95, 60, 40, 85, 100, 70, 35, 80, 50, 25].map((baseHeight, i) => (
            <motion.span
              key={i}
              className="w-1.5 h-full rounded-full bg-gradient-to-t from-purple-600 via-purple-300 to-pink-200 shadow-[0_0_8px_rgba(192,132,252,0.6)] origin-center"
              animate={{
                scaleY: isPlaying
                  ? [Math.max(0.15, (baseHeight * 0.4) / 100), baseHeight / 100, Math.max(0.15, (baseHeight * 0.3) / 100)]
                  : 0.2,
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2 + (i % 4) * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Listen Button */}
        <motion.button
          type="button"
          onClick={handleListen}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-800/90 via-purple-600/90 to-purple-900/90 border border-purple-300/60 shadow-[0_0_35px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(192,132,252,0.8)] text-white font-medium text-xs sm:text-sm tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md flex items-center gap-3"
        >
          <Headphones className="w-5 h-5 text-purple-200 animate-pulse" />
          <span className="shimmer-text">
            {data.voiceButtonText || "LISTEN TO MY MESSAGE 🎧"}
          </span>
        </motion.button>
      </motion.div>

      {/* After Audio / Post-Listen Reveal */}
      <AnimatePresence>
        {(hasInteracted || isPlaying) && (
          <motion.div
            initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 max-w-xl flex flex-col items-center gap-4"
          >
            {/* "Thank you for being you." */}
            <motion.h3
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="font-cinzel text-xl sm:text-3xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-pink-100 to-purple-200"
            >
              {data.voiceAfterTitle || "Thank you for being you."}
            </motion.h3>

            {/* Gratitude Lines */}
            <div className="flex flex-col gap-2 font-cormorant text-lg sm:text-2xl text-purple-200/90 font-light italic leading-relaxed">
              {(data.voiceAfterText || [
                "Thank you for the smiles.",
                "Thank you for the memories.",
                "Thank you for the little moments.",
                "And thank you for simply being part of my life."
              ]).map((line, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.25, duration: 0.8 }}
                >
                  "{line}"
                </motion.p>
              ))}
            </div>

            {/* Heart icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6, type: 'spring' }}
              className="mt-2"
            >
              <Heart className="w-6 h-6 text-pink-400 fill-pink-500/40 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button to proceed to Four Wishes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="mt-12"
      >
        <button
          type="button"
          onClick={onNext}
          className="group relative px-8 py-4 rounded-full bg-purple-950/70 border border-purple-400/50 hover:border-purple-300 shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_45px_rgba(192,132,252,0.6)] text-white tracking-widest text-xs sm:text-sm uppercase font-medium transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl flex items-center gap-3"
        >
          <span className="shimmer-text">Four Wishes For You</span>
          <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.section>
  );
}
