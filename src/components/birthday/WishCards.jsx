import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Moon, Rocket } from 'lucide-react';

const ICON_MAP = {
  Heart: Heart,
  Sparkles: Sparkles,
  Moon: Moon,
  Rocket: Rocket,
};

export default function WishCards({ cards }) {
  return (
    <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
      {cards.map((card, idx) => {
        const IconComponent = ICON_MAP[card.icon] || Sparkles;

        return (
          <motion.div
            key={card.id || idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8 + idx * 0.15,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              y: -8,
              transition: { duration: 0.3 },
            }}
            className="group relative p-6 sm:p-7 rounded-2xl glass-panel border border-purple-500/20 hover:border-purple-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-500 overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient hover glow inside card */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-all duration-500 pointer-events-none" />

            <div>
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-400/40 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(192,132,252,0.6)] transition-all duration-300">
                <IconComponent className="w-6 h-6 text-purple-300 group-hover:text-white transition-colors" />
              </div>

              {/* Title */}
              <h3 className="font-cinzel text-lg sm:text-xl font-semibold text-white tracking-wide mb-1 flex items-center justify-between">
                <span>{card.title}</span>
                {card.subtitle && (
                  <span className="text-[10px] font-sans tracking-widest uppercase text-purple-300/60 font-normal">
                    {card.subtitle}
                  </span>
                )}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed font-light mt-2">
                "{card.description}"
              </p>
            </div>

            {/* Subtle bottom border accent */}
            <div className="mt-6 pt-3 border-t border-purple-500/10 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-purple-400/60 group-hover:text-purple-300 transition-colors">
                Gift of Love
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400/40 group-hover:bg-purple-300 group-hover:shadow-[0_0_8px_#c084fc] transition-all" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
