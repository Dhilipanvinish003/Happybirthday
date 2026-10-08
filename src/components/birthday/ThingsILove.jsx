import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Smile, Sun, Moon, ArrowRight } from 'lucide-react';

const ICON_MAP = {
  Smile: Smile,
  Heart: Heart,
  Sparkles: Sparkles,
  Sun: Sun,
  Moon: Moon,
  Stars: Sparkles,
};

export default function ThingsILove({ data, onNext }) {
  const cards = data.thingsCards || [];

  return (
    <motion.section
      key="things-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.4, ease: "easeOut" } }}
      className="relative min-h-[92vh] min-h-[92dvh] w-full flex flex-col items-center justify-start px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center"
    >
      {/* Background ambient glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-8 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-2 mb-2"
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="text-xs uppercase tracking-[0.4em] text-purple-300/80 font-medium">
            From The Heart
          </span>
          <Sparkles className="w-4 h-4 text-purple-300" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-cinzel text-3xl sm:text-5xl font-light text-white tracking-widest leading-tight uppercase"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-300">
            {data.thingsHeading || "THINGS I LOVE ABOUT YOU ✨"}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="text-xs sm:text-sm text-purple-200/80 tracking-widest font-light mt-2"
        >
          {data.thingsSubtitle || "It's impossible to fit everything into one page, but here's a little start."}
        </motion.p>
      </div>

      {/* 6 Cards Grid (Responsive: 1 col on mobile, 2 on tablet, 3 on desktop) */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
        {cards.map((card, idx) => {
          const IconComponent = ICON_MAP[card.icon] || Heart;

          return (
            <motion.div
              key={card.id || idx}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + idx * 0.12,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.3 },
              }}
              className="group relative p-6 sm:p-7 rounded-2xl glass-panel border border-purple-500/20 hover:border-purple-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-500 overflow-hidden flex flex-col justify-between text-left"
            >
              {/* Inner ambient glow on hover */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-all duration-500 pointer-events-none" />

              <div>
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-400/40 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(192,132,252,0.6)] transition-all duration-300">
                  <IconComponent className="w-6 h-6 text-purple-300 group-hover:text-white transition-colors" />
                </div>

                {/* Title */}
                <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-white tracking-wide mb-2">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed font-light whitespace-pre-line">
                  "{card.description}"
                </p>
              </div>

              {/* Bottom Subtle Accent */}
              <div className="mt-6 pt-3 border-t border-purple-500/10 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-purple-400/60 group-hover:text-purple-300 transition-colors">
                  0{idx + 1}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400/40 group-hover:bg-purple-300 group-hover:shadow-[0_0_8px_#c084fc] transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Button to proceed to Memories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-12"
      >
        <button
          type="button"
          onClick={onNext}
          className="group relative px-8 py-4 rounded-full bg-purple-950/70 border border-purple-400/50 hover:border-purple-300 shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_45px_rgba(192,132,252,0.6)] text-white tracking-widest text-xs sm:text-sm uppercase font-medium transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl flex items-center gap-3"
        >
          <span className="shimmer-text">Our Little Memories</span>
          <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.section>
  );
}
