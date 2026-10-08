import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

import WishCards from './WishCards';

export default function WishSection({ data, onNext }) {
  const messageLines = data.wishMessageLines || [
    "May this new chapter of your life",
    "be filled with happiness, beautiful memories,",
    "success, peace, and everything your heart wishes for."
  ];

  return (
    <motion.section
      key="wish-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.4, ease: "easeOut" } }}
      className="relative min-h-[92vh] min-h-[92dvh] w-full flex flex-col items-center justify-start px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center"
    >
      {/* Soft background aura */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none -z-10" />

      {/* Header Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-2 mb-3"
      >
        <Sparkles className="w-4 h-4 text-purple-300" />
        <span className="text-xs uppercase tracking-[0.4em] text-purple-300/80 font-medium">
          Heartfelt Blessing
        </span>
        <Sparkles className="w-4 h-4 text-purple-300" />
      </motion.div>

      {/* Main Stage Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-widest leading-snug uppercase mb-8"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-300">
          {data.wishTitle || "IF I COULD GIVE YOU FOUR THINGS..."}
        </span>
      </motion.h2>

      {/* Staggered Line by Line Reveal */}
      {messageLines && messageLines.length > 0 && (
        <div className="max-w-2xl mx-auto flex flex-col gap-2.5 mb-8">
          {messageLines.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: 0.35 + idx * 0.25,
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-cormorant text-xl sm:text-2xl md:text-3xl text-purple-100/90 font-normal italic tracking-wide leading-relaxed"
            >
              "{line}"
            </motion.p>
          ))}
        </div>
      )}

      {/* 4 Premium Glass Cards */}
      <WishCards cards={data.wishCards || []} />

      {/* Transition to Future CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="mt-12"
      >
        <button
          type="button"
          onClick={onNext}
          className="group relative px-8 py-4 rounded-full bg-purple-950/70 border border-purple-400/50 hover:border-purple-300 shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_45px_rgba(192,132,252,0.6)] text-white tracking-widest text-xs sm:text-sm uppercase font-medium transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl flex items-center gap-3"
        >
          <span className="shimmer-text">And About Tomorrow...</span>
          <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.section>
  );
}
