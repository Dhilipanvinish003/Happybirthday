import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function FutureSection({ data, onNext }) {
  const paragraphs = data.futureParagraphs || [
    "I don't want to promise you a perfect future.",
    "I just hope that whatever the future brings, there will be many beautiful moments, laughs, conversations, random adventures, and memories waiting for us.",
    "One day we'll look back at today and realize how many beautiful chapters were still waiting to be written.",
    "Here's to everything that's still ahead. ✨"
  ];

  return (
    <motion.section
      key="future-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.4, ease: "easeOut" } }}
      className="relative min-h-[92vh] min-h-[92dvh] w-full flex flex-col items-center justify-start px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center select-none"
    >
      {/* Ambient background glow */}
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
          Looking Ahead
        </span>
        <Sparkles className="w-4 h-4 text-purple-300" />
      </motion.div>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="font-cinzel text-3xl sm:text-5xl font-light text-white tracking-widest leading-snug uppercase mb-8 max-w-2xl"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-300">
          {data.futureHeading || "AND ABOUT TOMORROW..."}
        </span>
      </motion.h2>

      {/* Central Glass Card with Staggered Reading Flow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-2xl w-full p-8 sm:p-12 rounded-3xl glass-panel-glow border border-purple-400/30 shadow-[0_15px_45px_rgba(0,0,0,0.6)] flex flex-col gap-6 text-left"
      >
        {/* Subtle compass watermark */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        {paragraphs.map((p, idx) => {
          const isHighlight = idx === paragraphs.length - 1;

          return (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: 0.4 + idx * 0.3,
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`font-cormorant leading-relaxed ${
                isHighlight
                  ? 'text-xl sm:text-2xl italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-pink-200 to-purple-300 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)] pt-2'
                  : 'text-lg sm:text-2xl text-purple-100/90 font-light'
              }`}
            >
              {p}
            </motion.p>
          );
        })}
      </motion.div>

      {/* Continue Button */}
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
          <span className="shimmer-text">A Message For Your Future Self</span>
          <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.section>
  );
}
