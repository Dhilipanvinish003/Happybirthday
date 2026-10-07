import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const BALLOON_PRESETS = [
  { id: 1, left: 8, size: 76, delay: 0.1, duration: 8.5, color: 'bg-gradient-to-b from-rose-500 via-red-600 to-rose-950 border-rose-300/60 shadow-[0_0_30px_rgba(244,63,94,0.6)]', stringColor: 'from-rose-400/70 via-rose-500/40 to-transparent shadow-[0_0_8px_rgba(244,63,94,0.7)]', knotColor: 'bg-rose-600', trailColor: 'bg-rose-300/80', glow: '#f43f5e' },
  { id: 2, left: 18, size: 88, delay: 0.8, duration: 9.2, color: 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-950 border-amber-200/60 shadow-[0_0_30px_rgba(245,158,11,0.6)]', stringColor: 'from-amber-400/70 via-amber-500/40 to-transparent shadow-[0_0_8px_rgba(245,158,11,0.7)]', knotColor: 'bg-amber-600', trailColor: 'bg-amber-300/80', glow: '#f59e0b' },
  { id: 3, left: 28, size: 68, delay: 0.3, duration: 7.8, color: 'bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-950 border-cyan-200/60 shadow-[0_0_25px_rgba(6,182,212,0.6)]', stringColor: 'from-cyan-400/70 via-cyan-500/40 to-transparent shadow-[0_0_8px_rgba(6,182,212,0.7)]', knotColor: 'bg-cyan-600', trailColor: 'bg-cyan-300/80', glow: '#06b6d4' },
  { id: 4, left: 40, size: 95, delay: 1.2, duration: 9.8, color: 'bg-gradient-to-b from-pink-400 via-fuchsia-600 to-pink-950 border-pink-200/60 shadow-[0_0_40px_rgba(236,72,153,0.6)]', stringColor: 'from-pink-400/70 via-pink-500/40 to-transparent shadow-[0_0_8px_rgba(236,72,153,0.7)]', knotColor: 'bg-pink-600', trailColor: 'bg-pink-300/80', glow: '#ec4899' },
  { id: 5, left: 52, size: 76, delay: 0.5, duration: 8.2, color: 'bg-gradient-to-b from-emerald-400 via-emerald-600 to-teal-950 border-emerald-200/60 shadow-[0_0_30px_rgba(16,185,129,0.6)]', stringColor: 'from-emerald-400/70 via-emerald-500/40 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.7)]', knotColor: 'bg-emerald-600', trailColor: 'bg-emerald-300/80', glow: '#10b981' },
  { id: 6, left: 64, size: 90, delay: 1.5, duration: 9.5, color: 'bg-gradient-to-b from-purple-400 via-violet-600 to-purple-950 border-purple-200/60 shadow-[0_0_35px_rgba(168,85,247,0.6)]', stringColor: 'from-purple-400/70 via-purple-500/40 to-transparent shadow-[0_0_8px_rgba(168,85,247,0.7)]', knotColor: 'bg-purple-600', trailColor: 'bg-purple-300/80', glow: '#a855f7' },
  { id: 7, left: 75, size: 70, delay: 0.2, duration: 7.5, color: 'bg-gradient-to-b from-orange-400 via-orange-500 to-red-950 border-orange-200/60 shadow-[0_0_25px_rgba(249,115,22,0.6)]', stringColor: 'from-orange-400/70 via-orange-500/40 to-transparent shadow-[0_0_8px_rgba(249,115,22,0.7)]', knotColor: 'bg-orange-600', trailColor: 'bg-orange-300/80', glow: '#f97316' },
  { id: 8, left: 86, size: 84, delay: 2.2, duration: 8.0, color: 'bg-gradient-to-b from-blue-400 via-indigo-600 to-slate-950 border-blue-200/60 shadow-[0_0_30px_rgba(59,130,246,0.6)]', stringColor: 'from-blue-400/70 via-blue-500/40 to-transparent shadow-[0_0_8px_rgba(59,130,246,0.7)]', knotColor: 'bg-blue-600', trailColor: 'bg-blue-300/80', glow: '#3b82f6' },
  { id: 9, left: 14, size: 78, delay: 2.8, duration: 8.6, color: 'bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-950 border-yellow-100/60 shadow-[0_0_30px_rgba(234,179,8,0.6)]', stringColor: 'from-yellow-300/70 via-yellow-400/40 to-transparent shadow-[0_0_8px_rgba(234,179,8,0.7)]', knotColor: 'bg-yellow-500', trailColor: 'bg-yellow-200/80', glow: '#eab308' },
  { id: 10, left: 34, size: 72, delay: 2.5, duration: 8.4, color: 'bg-gradient-to-b from-fuchsia-400 via-pink-500 to-purple-950 border-fuchsia-200/60 shadow-[0_0_30px_rgba(217,70,239,0.6)]', stringColor: 'from-fuchsia-400/70 via-fuchsia-500/40 to-transparent shadow-[0_0_8px_rgba(217,70,239,0.7)]', knotColor: 'bg-fuchsia-600', trailColor: 'bg-fuchsia-300/80', glow: '#d946ef' },
  { id: 11, left: 58, size: 92, delay: 2.0, duration: 9.0, color: 'bg-gradient-to-b from-teal-400 via-emerald-500 to-teal-950 border-teal-200/60 shadow-[0_0_35px_rgba(20,184,166,0.6)]', stringColor: 'from-teal-400/70 via-teal-500/40 to-transparent shadow-[0_0_8px_rgba(20,184,166,0.7)]', knotColor: 'bg-teal-600', trailColor: 'bg-teal-300/80', glow: '#14b8a6' },
  { id: 12, left: 92, size: 74, delay: 3.2, duration: 8.8, color: 'bg-gradient-to-b from-rose-400 via-pink-600 to-rose-950 border-rose-200/60 shadow-[0_0_30px_rgba(244,63,94,0.6)]', stringColor: 'from-rose-400/70 via-rose-500/40 to-transparent shadow-[0_0_8px_rgba(244,63,94,0.7)]', knotColor: 'bg-rose-600', trailColor: 'bg-rose-300/80', glow: '#f43f5e' },
];

export default function BalloonScene({ data, onComplete }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Stage transition timers
    const timer1 = setTimeout(() => {
      setStep(2);
    }, 3600);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 7800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <motion.section
      key="balloon-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(12px)', transition: { duration: 1.5 } }}
      className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Floating balloons container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {BALLOON_PRESETS.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: '115vh', x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: '-25vh',
              x: [0, (b.id % 2 === 0 ? 30 : -30), 0, (b.id % 2 === 0 ? -25 : 25), 0],
              opacity: [0, 0.95, 0.95, 0.95, 0],
              rotate: [0, (b.id % 2 === 0 ? 8 : -8), 0, (b.id % 2 === 0 ? -6 : 6), 0],
              scale: [0.85, 1, 1.05, 1],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              ease: [0.25, 0.1, 0.25, 1],
              x: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
            }}
            style={{ left: `${b.left}%`, position: 'absolute' }}
            className="flex flex-col items-center"
          >
            {/* Balloon Body */}
            <div
              style={{ width: `${b.size}px`, height: `${b.size * 1.25}px` }}
              className={`relative rounded-[50%_50%_50%_50%/40%_40%_60%_60%] border ${b.color} transition-all duration-300`}
            >
              {/* Glossy specular highlight */}
              <div className="absolute top-2 left-3 w-3 h-6 rounded-full bg-white/30 blur-[1px] rotate-[-25deg]" />
              
              {/* Bottom knot */}
              <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2 rounded-sm clip-path-triangle ${b.knotColor || 'bg-purple-700/80'}`} />
            </div>

            {/* Glowing string */}
            <div className={`w-[1.5px] h-28 bg-gradient-to-b ${b.stringColor || 'from-purple-400/70 via-purple-500/40 to-transparent shadow-[0_0_8px_rgba(192,132,252,0.8)]'}`} />

            {/* Following particle trail */}
            <div className={`w-1.5 h-1.5 rounded-full blur-[1px] animate-ping ${b.trailColor || 'bg-purple-300/80'}`} />
          </motion.div>
        ))}
      </div>

      {/* Center Cinematic Typography */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.92, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-4 h-4 text-purple-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-xs uppercase tracking-[0.4em] text-purple-300/80">Every Story Begins</span>
                <Sparkles className="w-4 h-4 text-purple-300 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <h2 className="font-cormorant text-2xl sm:text-4xl md:text-5xl font-light italic text-white tracking-wide leading-relaxed">
                "{data.balloonLine1 || "Every beautiful story has a special beginning..."}"
              </h2>
              <p className="font-outfit text-sm sm:text-lg text-purple-200/90 font-light max-w-xl leading-relaxed mt-1">
                {data.balloonLine2 || "And somehow, mine became more beautiful when you became a part of it."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-xs sm:text-sm uppercase tracking-[0.4em] text-purple-200/80">
                A Moment For You
              </span>
              <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-light tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-fuchsia-200 to-purple-400 drop-shadow-[0_0_35px_rgba(192,132,252,0.6)]">
                {data.balloonLine3 || "Now close your eyes for a second..."}
              </h2>
              <p className="font-cormorant italic text-lg sm:text-2xl text-purple-200/90 tracking-wide font-normal">
                "{data.balloonLine4 || "Because something special is waiting for you."}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick skip button for fast navigation */}
        <motion.button
          type="button"
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          className="mt-12 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-purple-300/80 hover:text-white px-5 py-2 rounded-full border border-purple-500/30 bg-purple-950/40 backdrop-blur-md cursor-pointer transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]"
        >
          <span>Reveal Cake</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.section>
  );
}
