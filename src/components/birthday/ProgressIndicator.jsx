import React from 'react';
import { motion } from 'framer-motion';

const STAGES = [
  { id: 1, label: 'Welcome' },
  { id: 2, label: 'Story' },
  { id: 3, label: 'Cake' },
  { id: 4, label: 'Wish to Stars' },
  { id: 5, label: 'Love Letter' },
  { id: 6, label: 'Things I Love' },
  { id: 7, label: 'Memories' },
  { id: 8, label: 'Voice' },
  { id: 9, label: 'Four Wishes' },
  { id: 10, label: 'Tomorrow' },
  { id: 11, label: 'Future Self' },
  { id: 12, label: 'Always You' },
];

export default function ProgressIndicator({ currentStage, onSelectStage, maxUnlockedStage }) {
  // If still on opening screen, keep indicator minimal and unobtrusive
  return (
    <nav 
      aria-label="Experience Progress"
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-3 sm:px-5 py-2 rounded-full glass-panel border border-purple-500/20 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center gap-1.5 sm:gap-3">
        {STAGES.map((stage, idx) => {
          const isActive = currentStage === stage.id;
          const isPassed = currentStage > stage.id;
          const isUnlocked = stage.id <= (maxUnlockedStage || 1);

          return (
            <React.Fragment key={stage.id}>
              {/* Node Button */}
              <button
                type="button"
                onClick={() => isUnlocked && onSelectStage(stage.id)}
                disabled={!isUnlocked}
                aria-label={`Go to stage ${stage.id}: ${stage.label}`}
                title={stage.label}
                className={`group relative flex items-center justify-center transition-all duration-300 ${
                  isUnlocked ? 'cursor-pointer' : 'cursor-default opacity-40'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-500 ${
                    isActive
                      ? 'bg-purple-400 scale-125 shadow-[0_0_12px_#c084fc,0_0_24px_#a855f7]'
                      : isPassed
                      ? 'bg-purple-600/70 border border-purple-400/40'
                      : 'bg-white/20 border border-white/10'
                  }`}
                />

                {/* Pulse ring for active step */}
                {isActive && (
                  <motion.div
                    className="absolute -inset-1 rounded-full border border-purple-400/60"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  />
                )}

                {/* Desktop Tooltip */}
                <span className="hidden md:group-hover:block absolute top-full mt-2.5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-black/80 text-purple-200 border border-purple-500/30 whitespace-nowrap pointer-events-none">
                  {stage.label}
                </span>
              </button>

              {/* Connecting line */}
              {idx < STAGES.length - 1 && (
                <div
                  className={`h-[1px] w-3 sm:w-6 transition-all duration-500 ${
                    isPassed
                      ? 'bg-gradient-to-r from-purple-500 to-purple-400'
                      : 'bg-white/10'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
