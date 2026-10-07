import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export default function WelcomeScreen({ data, onOpenSurprise }) {
  return (
    <motion.section
      key="welcome-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center select-none"
    >
      {/* Ambient background glow circle */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none -z-10" />

      {/* Subtle floating decorative stars */}
      <motion.div
        animate={{ y: [-6, 6, -6], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="mb-6 flex items-center justify-center gap-2 text-purple-400/80"
      >
        <Sparkles className="w-4 h-4 text-purple-300" />
        <span className="text-xs sm:text-sm uppercase tracking-[0.35em] text-purple-300/80 font-medium">
          {data.openingSmallText || "A LITTLE SURPRISE FOR YOU"}
        </span>
        <Sparkles className="w-4 h-4 text-purple-300" />
      </motion.div>

      {/* Main cinematic invitation */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mb-4"
      >
        <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide leading-snug sm:leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-300">
            {data.openingLeadText || "Today isn't just your birthday..."}
          </span>
        </h1>
      </motion.div>

      {/* Celebration of You highlight */}
      <motion.div
        initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.8, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-5"
      >
        <p className="font-cormorant text-2xl sm:text-3xl md:text-4xl italic text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 font-medium drop-shadow-[0_0_20px_rgba(192,132,252,0.6)]">
          {data.openingSubLead || "It's a celebration of YOU."}
        </p>
      </motion.div>

      {/* Poetic lead paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 1.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl mb-8"
      >
        <p className="font-outfit text-sm sm:text-base text-purple-200/80 font-light leading-relaxed whitespace-pre-line tracking-wide">
          {data.openingDescription || "I wanted to give you something\nyou could feel,\nnot just something you could open."}
        </p>
      </motion.div>

      {/* Animated Heart with pulse */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.8, type: "spring" }}
        className="relative mb-6"
      >
        <motion.div
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="relative"
        >
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 fill-purple-500/30 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" />
        </motion.div>
        
        {/* Subtle glow behind heart */}
        <div className="absolute inset-0 bg-purple-500/40 blur-xl -z-10 rounded-full" />
      </motion.div>

      {/* CTA Button: OPEN YOUR SURPRISE ✨ */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.9 }}
        className="relative group"
      >
        {/* Animated aura ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-700 animate-pulse" />

        <button
          type="button"
          onClick={onOpenSurprise}
          className="relative px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-[#050507]/90 border border-purple-400/50 hover:border-purple-300 text-white font-medium text-base sm:text-lg tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(192,132,252,0.7)] transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-xl group-hover:scale-[1.03] active:scale-[0.98]"
        >
          {/* Glass reflection beam */}
          <span className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000" />
          
          <span className="relative flex items-center justify-center gap-3">
            <span className="shimmer-text font-semibold">
              {data.buttonText || "OPEN YOUR SURPRISE ✨"}
            </span>
            <Sparkles className="w-5 h-5 text-purple-300 group-hover:rotate-12 transition-transform duration-300" />
          </span>
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="mt-8 text-xs tracking-widest text-purple-300/50 uppercase"
      >
        Touch to begin the journey • Sound on recommended
      </motion.p>
    </motion.section>
  );
}
