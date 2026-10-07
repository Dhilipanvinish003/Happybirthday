import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bookmark, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FutureMessage({ data, onNext }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveMoment = () => {
    setIsSaved(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#A855F7', '#C084FC', '#FDE047', '#E9D5FF'],
      disableForReducedMotion: true,
    });
  };

  return (
    <motion.section
      key="future-message-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)', transition: { duration: 1.2 } }}
      className="relative min-h-[92vh] w-full flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-16 text-center select-none"
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
          A Message To Carry
        </span>
        <Sparkles className="w-4 h-4 text-purple-300" />
      </motion.div>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-widest leading-snug uppercase mb-4 max-w-2xl"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-300">
          {data.futureMessageHeading || "ONE LITTLE MESSAGE FOR YOUR FUTURE SELF 💌"}
        </span>
      </motion.h2>

      {/* Intro */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="font-cormorant italic text-lg sm:text-2xl text-purple-200/90 font-light mb-8 max-w-lg whitespace-pre-line"
      >
        "{data.futureMessageIntro || "Before you leave this little birthday world,\nI want you to remember one thing..."}"
      </motion.p>

      {/* Message Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-2xl w-full p-8 sm:p-12 rounded-3xl glass-panel-glow border border-purple-400/35 shadow-[0_15px_45px_rgba(0,0,0,0.6)] flex flex-col gap-6 text-center"
      >
        {/* Core Message Body */}
        <div className="flex flex-col gap-4 font-cormorant text-xl sm:text-2xl md:text-3xl text-purple-100/90 font-light leading-relaxed">
          {(data.futureMessageBody || [
            "You are capable of more than you think.",
            "You deserve more happiness than you sometimes allow yourself.",
            "And I hope you never stop becoming the person you dream of being."
          ]).map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.5 + idx * 0.3, duration: 0.9 }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Affirmations */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.9 }}
          className="pt-6 border-t border-purple-500/20 flex flex-col items-center gap-1 font-cinzel text-xs sm:text-sm tracking-[0.3em] uppercase text-purple-200/90 font-medium"
        >
          <span>Keep smiling.</span>
          <span>Keep dreaming.</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 font-semibold">
            Keep being you.
          </span>
        </motion.div>

        {/* SAVE THIS MOMENT BUTTON */}
        <div className="pt-4 flex flex-col items-center gap-4">
          <motion.button
            type="button"
            onClick={handleSaveMoment}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`group relative px-8 py-3.5 rounded-full border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md flex items-center gap-2.5 text-xs sm:text-sm uppercase tracking-[0.25em] font-medium ${
              isSaved
                ? 'bg-purple-900/60 border-purple-300 text-purple-100 shadow-[0_0_25px_rgba(192,132,252,0.6)]'
                : 'bg-black/40 border-purple-400/50 hover:border-purple-300 text-purple-200 hover:text-white shadow-[0_0_25px_rgba(124,58,237,0.3)]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'text-pink-300 fill-pink-300' : 'text-purple-300'}`} />
            <span>{isSaved ? "Moment Saved ✨" : (data.futureMessageButton || "SAVE THIS MOMENT ✨")}</span>
          </motion.button>

          {/* After interaction text */}
          <AnimatePresence>
            {isSaved && (
              <motion.p
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8 }}
                className="font-cormorant italic text-base sm:text-xl text-purple-200/90 font-light"
              >
                "{data.futureMessageSaved || "Maybe come back here one day and see how far you've come."}"
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Button to proceed to Final Love Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="mt-12"
      >
        <button
          type="button"
          onClick={onNext}
          className="group relative px-8 py-4 rounded-full bg-purple-950/70 border border-purple-400/50 hover:border-purple-300 shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_45px_rgba(192,132,252,0.6)] text-white tracking-widest text-xs sm:text-sm uppercase font-medium transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl flex items-center gap-3"
        >
          <span className="shimmer-text">One Last Thing...</span>
          <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.section>
  );
}
