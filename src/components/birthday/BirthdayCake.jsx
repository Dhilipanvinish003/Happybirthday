import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import CandleInteraction from './CandleInteraction';

// Premium Black & Purple floating balloons inside the cake room (Background, Middle, Foreground)
const SCENE_BALLOONS = [
  // Background layer (subtle blur, deeper black & purple tones)
  { id: 'bg-1', depth: 'bg', left: '6%', size: 48, duration: 18, delay: -2, driftX: 20, rot: 4, color: 'bg-gradient-to-b from-[#1b082e] via-[#090212] to-black border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.3)]', stringColor: 'bg-purple-400/30', blur: 'blur-[1.5px]' },
  { id: 'bg-2', depth: 'bg', left: '15%', size: 54, duration: 21, delay: -8, driftX: -25, rot: -5, color: 'bg-gradient-to-b from-[#581c87]/90 via-[#2e1065]/95 to-black border-purple-400/40 shadow-[0_0_25px_rgba(168,85,247,0.4)]', stringColor: 'bg-purple-400/30', blur: 'blur-[1px]' },
  { id: 'bg-3', depth: 'bg', left: '24%', size: 44, duration: 19, delay: -14, driftX: 18, rot: 3, color: 'bg-gradient-to-b from-black via-[#160626] to-[#05010a] border-purple-600/30 shadow-[0_0_15px_rgba(124,58,237,0.25)]', stringColor: 'bg-purple-400/25', blur: 'blur-[2px]' },
  { id: 'bg-4', depth: 'bg', left: '33%', size: 42, duration: 22, delay: -5, driftX: -15, rot: -4, color: 'bg-gradient-to-b from-[#3b0764]/90 via-[#130321] to-black border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.3)]', stringColor: 'bg-purple-400/25', blur: 'blur-[2px]' },
  { id: 'bg-5', depth: 'bg', left: '67%', size: 46, duration: 20, delay: -11, driftX: 22, rot: 4, color: 'bg-gradient-to-b from-[#6b21a8]/85 via-[#230742] to-black border-purple-400/40 shadow-[0_0_22px_rgba(168,85,247,0.35)]', stringColor: 'bg-purple-400/30', blur: 'blur-[1.5px]' },
  { id: 'bg-6', depth: 'bg', left: '76%', size: 52, duration: 17, delay: -3, driftX: -20, rot: -3, color: 'bg-gradient-to-b from-[#18052b] via-[#080112] to-black border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.3)]', stringColor: 'bg-purple-400/25', blur: 'blur-[1.5px]' },
  { id: 'bg-7', depth: 'bg', left: '85%', size: 46, duration: 23, delay: -16, driftX: 15, rot: 5, color: 'bg-gradient-to-b from-[#4c1d95]/90 via-[#1f093d] to-black border-purple-400/35 shadow-[0_0_20px_rgba(168,85,247,0.35)]', stringColor: 'bg-purple-400/30', blur: 'blur-[2px]' },
  { id: 'bg-8', depth: 'bg', left: '94%', size: 50, duration: 19, delay: -9, driftX: -18, rot: -4, color: 'bg-gradient-to-b from-black via-[#1a052e] to-black border-purple-600/30 shadow-[0_0_15px_rgba(124,58,237,0.25)]', stringColor: 'bg-purple-400/25', blur: 'blur-[1.5px]' },

  // Middle layer (rich royal purple & glossy jet black)
  { id: 'mid-1', depth: 'mid', left: '4%', size: 72, duration: 15, delay: -1, driftX: 25, rot: 6, color: 'bg-gradient-to-b from-[#2e1065] via-[#100321] to-black border-purple-400/40 shadow-[0_0_28px_rgba(147,51,234,0.45)]', stringColor: 'from-purple-400/60 to-transparent', knotColor: 'bg-[#1e0736] border border-purple-500/40', blur: '' },
  { id: 'mid-2', depth: 'mid', left: '11%', size: 68, duration: 16, delay: -7, driftX: -28, rot: -6, color: 'bg-gradient-to-b from-[#9333ea] via-[#581c87] to-[#1e0736] border-purple-300/60 shadow-[0_0_35px_rgba(168,85,247,0.6)]', stringColor: 'from-purple-300/70 to-transparent', knotColor: 'bg-[#7e22ce]', blur: '' },
  { id: 'mid-3', depth: 'mid', left: '19%', size: 64, duration: 14, delay: -12, driftX: 20, rot: 5, color: 'bg-gradient-to-b from-[#160626] via-[#090212] to-black border-purple-500/35 shadow-[0_0_24px_rgba(147,51,234,0.4)]', stringColor: 'from-purple-400/50 to-transparent', knotColor: 'bg-[#100321] border border-purple-600/40', blur: '' },
  { id: 'mid-4', depth: 'mid', left: '27%', size: 60, duration: 17, delay: -4, driftX: -22, rot: -4, color: 'bg-gradient-to-b from-[#7e22ce] via-[#3b0764] to-[#120324] border-purple-400/50 shadow-[0_0_30px_rgba(192,132,252,0.5)]', stringColor: 'from-purple-300/60 to-transparent', knotColor: 'bg-[#6b21a8]', blur: '' },
  { id: 'mid-5', depth: 'mid', left: '71%', size: 62, duration: 15, delay: -10, driftX: 24, rot: 5, color: 'bg-gradient-to-b from-[#1f093d] via-[#0a0214] to-black border-purple-400/40 shadow-[0_0_26px_rgba(147,51,234,0.4)]', stringColor: 'from-purple-400/50 to-transparent', knotColor: 'bg-[#150329] border border-purple-600/40', blur: '' },
  { id: 'mid-6', depth: 'mid', left: '79%', size: 70, duration: 16, delay: -2, driftX: -26, rot: -5, color: 'bg-gradient-to-b from-[#a855f7] via-[#6b21a8] to-[#2e1065] border-purple-300/60 shadow-[0_0_38px_rgba(192,132,252,0.65)]', stringColor: 'from-purple-300/70 to-transparent', knotColor: 'bg-[#9333ea]', blur: '' },
  { id: 'mid-7', depth: 'mid', left: '87%', size: 66, duration: 14, delay: -13, driftX: 22, rot: 6, color: 'bg-gradient-to-b from-[#2a0e4a] via-[#100421] to-black border-purple-400/40 shadow-[0_0_25px_rgba(168,85,247,0.45)]', stringColor: 'from-purple-400/60 to-transparent', knotColor: 'bg-[#1b0533] border border-purple-500/40', blur: '' },
  { id: 'mid-8', depth: 'mid', left: '95%', size: 68, duration: 18, delay: -6, driftX: -20, rot: -4, color: 'bg-gradient-to-b from-[#7e22ce] via-[#4c1d95] to-[#1e0736] border-purple-300/50 shadow-[0_0_32px_rgba(168,85,247,0.55)]', stringColor: 'from-purple-400/60 to-transparent', knotColor: 'bg-[#6b21a8]', blur: '' },

  // Foreground layer (larger, luminous neon violet & luxury deep black reflections)
  { id: 'fg-1', depth: 'fg', left: '2%', size: 88, duration: 12, delay: -3, driftX: 28, rot: 7, color: 'bg-gradient-to-b from-[#3b0764] via-[#18042b] to-black border-purple-400/60 shadow-[0_0_35px_rgba(192,132,252,0.55)]', stringColor: 'from-purple-400/70 to-transparent shadow-[0_0_8px_rgba(192,132,252,0.6)]', knotColor: 'bg-[#2a0647] border border-purple-400/50', blur: '' },
  { id: 'fg-2', depth: 'fg', left: '8%', size: 82, duration: 13.5, delay: -9, driftX: -30, rot: -7, color: 'bg-gradient-to-b from-[#c084fc] via-[#9333ea] to-[#3b0764] border-purple-200/70 shadow-[0_0_42px_rgba(192,132,252,0.75)]', stringColor: 'from-purple-200/80 to-transparent shadow-[0_0_10px_rgba(192,132,252,0.8)]', knotColor: 'bg-[#9333ea]', blur: '' },
  { id: 'fg-3', depth: 'fg', left: '16%', size: 76, duration: 13, delay: -6, driftX: 22, rot: 5, color: 'bg-gradient-to-b from-[#19062b] via-[#080210] to-black border-purple-500/40 shadow-[0_0_30px_rgba(147,51,234,0.5)]', stringColor: 'from-purple-400/60 to-transparent shadow-[0_0_6px_rgba(168,85,247,0.5)]', knotColor: 'bg-[#100321] border border-purple-500/40', blur: '' },
  { id: 'fg-4', depth: 'fg', left: '82%', size: 78, duration: 12.5, delay: -4, driftX: -25, rot: -6, color: 'bg-gradient-to-b from-[#1f0738] via-[#090214] to-black border-purple-500/40 shadow-[0_0_30px_rgba(147,51,234,0.5)]', stringColor: 'from-purple-400/60 to-transparent shadow-[0_0_6px_rgba(168,85,247,0.5)]', knotColor: 'bg-[#150329] border border-purple-500/40', blur: '' },
  { id: 'fg-5', depth: 'fg', left: '90%', size: 84, duration: 13, delay: -11, driftX: 26, rot: 6, color: 'bg-gradient-to-b from-[#a855f7] via-[#7e22ce] to-[#2e1065] border-purple-200/70 shadow-[0_0_40px_rgba(192,132,252,0.7)]', stringColor: 'from-purple-300/80 to-transparent shadow-[0_0_8px_rgba(192,132,252,0.7)]', knotColor: 'bg-[#7e22ce]', blur: '' },
  { id: 'fg-6', depth: 'fg', left: '96%', size: 92, duration: 11.5, delay: -1, driftX: -28, rot: -7, color: 'bg-gradient-to-b from-[#2e0c52] via-[#120324] to-black border-purple-400/60 shadow-[0_0_36px_rgba(168,85,247,0.55)]', stringColor: 'from-purple-400/70 to-transparent shadow-[0_0_8px_rgba(192,132,252,0.6)]', knotColor: 'bg-[#1e0736] border border-purple-400/50', blur: '' },
];

// Continuously looping celebratory flying texts with the 3 special names
const FLYING_TEXTS = [
  { id: 'fly-txt-1', text: 'Happy Birthday Anisha ✨', left: '7%', duration: 16, delay: -1, driftX: 18, rot: -3 },
  { id: 'fly-txt-2', text: 'Happy Birthday Shuttumani ❤️', left: '73%', duration: 18, delay: -4, driftX: -20, rot: 3 },
  { id: 'fly-txt-3', text: 'Happy Birthday Chundhariyee 💖', left: '16%', duration: 20, delay: -7, driftX: 15, rot: 2 },
  { id: 'fly-txt-4', text: 'Happy Birthday Anisha 💜', left: '81%', duration: 17, delay: -10, driftX: -16, rot: -2 },
  { id: 'fly-txt-5', text: 'Happy Birthday Shuttumani ✨', left: '24%', duration: 19, delay: -13, driftX: 16, rot: 3 },
  { id: 'fly-txt-6', text: 'Happy Birthday Chundhariyee ✨', left: '65%', duration: 21, delay: -16, driftX: -18, rot: -3 },
  { id: 'fly-txt-7', text: 'Happy Birthday Anisha 👑', left: '10%', duration: 18, delay: -8, driftX: -15, rot: -2 },
  { id: 'fly-txt-8', text: 'Happy Birthday Shuttumani 🌸', left: '77%', duration: 17, delay: -14, driftX: 18, rot: 4 },
  { id: 'fly-txt-9', text: 'Happy Birthday Chundhariyee 💜', left: '20%', duration: 22, delay: -3, driftX: -14, rot: 2 },
];

// 5 candles arranged gracefully directly on top of the cake tier
const CANDLE_CONFIGS = [
  { id: 1, left: '39%', top: '2.5%', height: 28, delay: 0 },
  { id: 2, left: '44.5%', top: '1.2%', height: 34, delay: 0.15 },
  { id: 3, left: '50%', top: '0.4%', height: 38, delay: 0.05 }, // Center tallest
  { id: 4, left: '55.5%', top: '1.2%', height: 34, delay: 0.2 },
  { id: 5, left: '61%', top: '2.5%', height: 28, delay: 0.1 },
];

export default function BirthdayCake({ data, onComplete, setDuckedVolume }) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isBlowingSequence, setIsBlowingSequence] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  // On mobile devices, use an optimized subset of balloons and texts to guarantee 60 FPS
  const visibleBalloons = useMemo(() => {
    if (!isMobile) return SCENE_BALLOONS;
    return SCENE_BALLOONS.filter((_, idx) => idx % 2 === 0);
  }, [isMobile]);

  const visibleTexts = useMemo(() => {
    if (!isMobile) return FLYING_TEXTS;
    return FLYING_TEXTS.filter((_, idx) => idx % 2 === 0);
  }, [isMobile]);

  // Gently duck music volume while listening to microphone, restore afterward
  useEffect(() => {
    if (setDuckedVolume && !candlesBlown) {
      setDuckedVolume(true);
    }
    return () => {
      if (setDuckedVolume) {
        setDuckedVolume(false);
      }
    };
  }, [candlesBlown, setDuckedVolume]);

  const handleBlowSuccess = () => {
    setCandlesBlown(true);
    setIsBlowingSequence(false);

    if (setDuckedVolume) {
      setDuckedVolume(false);
    }

    // Keep cake visible, then transition smoothly to WishToStars
    const timer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => clearTimeout(timer);
  };

  return (
    <motion.section
      key="cake-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.6 } }}
      className={`relative min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-between px-4 pt-16 sm:pt-20 pb-8 select-none overflow-hidden transition-colors duration-1000 ${
        candlesBlown ? 'bg-black/50' : 'bg-transparent'
      }`}
    >
      {/* ========================================================= */}
      {/* 1. UNIFIED FULLSCREEN ATMOSPHERIC ENVIRONMENT */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 -z-30 ${
          candlesBlown ? 'opacity-40' : 'opacity-80'
        }`}
      >
        {/* Soft violet spotlight onto the cake */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18)_0%,rgba(124,58,237,0.06)_50%,transparent_80%)] blur-2xl" />
        {/* Floor ambient glow underneath the cake */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[650px] h-[260px] bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.16)_0%,rgba(124,58,237,0.08)_45%,transparent_75%)] blur-3xl" />
      </div>

      {/* Subtle diagonal volumetric light rays */}
      <div className="absolute inset-0 pointer-events-none -z-25 opacity-20 bg-[radial-gradient(circle_at_20%_15%,rgba(192,132,252,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.12)_0%,transparent_50%)]" />

      {/* ========================================================= */}
      {/* 2. BALLOONS FLOATING INSIDE THE ROOM (Background Layer) */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {visibleBalloons.filter((b) => b.depth === 'bg').map((b) => (
          <div
            key={b.id}
            style={{
              left: b.left,
              position: 'absolute',
              '--fly-duration': `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              '--drift-x': `${b.driftX}px`,
              '--rot': `${b.rot}deg`,
            }}
            className={`animate-balloon-loop flex flex-col items-center ${b.blur}`}
          >
            <div
              style={{ width: `${b.size}px`, height: `${b.size * 1.25}px` }}
              className={`rounded-[50%_50%_50%_50%/40%_40%_60%_60%] border ${b.color} relative`}
            >
              <div className="absolute top-1.5 left-2 w-2 h-4 rounded-full bg-white/30 blur-[1px] rotate-[-25deg]" />
            </div>
            <div className={`w-[1px] h-20 ${b.stringColor || 'bg-purple-400/20'}`} />
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 2.5. CONTINUOUS LOOPING FLYING NAMES */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
        {visibleTexts.map((item) => (
          <div
            key={item.id}
            style={{
              left: item.left,
              position: 'absolute',
              '--fly-duration': `${item.duration}s`,
              animationDelay: `${item.delay}s`,
              '--drift-x': `${item.driftX}px`,
              '--rot': `${item.rot}deg`,
            }}
            className="animate-text-loop flex flex-col items-center pointer-events-none select-none z-15"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#0a0214]/90 border border-purple-400/50 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.45),inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <Sparkles className="w-3 h-3 text-purple-300 animate-pulse shrink-0" />
              <span className="font-cinzel text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-white to-purple-200 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)] whitespace-nowrap">
                {item.text}
              </span>
              <Sparkles className="w-3 h-3 text-purple-300 animate-pulse shrink-0" />
            </div>
            <div className="w-[1px] h-8 bg-gradient-to-b from-purple-400/50 to-transparent shadow-[0_0_6px_rgba(192,132,252,0.5)]" />
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 3. SCENE HEADER TEXT */}
      {/* ========================================================= */}
      <div className="text-center z-20 max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-2 mb-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.4em] text-purple-300/80 font-medium">
            {data.cakeHeading || "HAPPY BIRTHDAY"}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
        </motion.div>

        {/* Person's Name */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-cormorant text-4xl sm:text-6xl md:text-7xl font-semibold italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-white to-purple-200 drop-shadow-[0_0_25px_rgba(192,132,252,0.7)]"
        >
          {data.name || "Anisha"}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xs sm:text-sm text-purple-200/90 font-light tracking-[0.2em] uppercase mt-1 max-w-lg leading-relaxed"
        >
          {data.cakeSubtitle || "Today, the whole world gets to celebrate the beautiful person you are."}
        </motion.p>

        {/* Make a wish prompt */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-cormorant italic text-base sm:text-lg text-pink-200/90 tracking-wide mt-1"
        >
          "{data.cakeWishPrompt || "Make a wish, beautiful..."}"
        </motion.p>
      </div>

      {/* ========================================================= */}
      {/* 4. BALLOONS (Middle & Foreground Layer) */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {visibleBalloons.filter((b) => b.depth !== 'bg').map((b) => (
          <div
            key={b.id}
            style={{
              left: b.left,
              position: 'absolute',
              '--fly-duration': `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              '--drift-x': `${b.driftX}px`,
              '--rot': `${b.rot}deg`,
            }}
            className={`animate-balloon-loop flex flex-col items-center ${b.blur}`}
          >
            <div
              style={{ width: `${b.size}px`, height: `${b.size * 1.25}px` }}
              className={`rounded-[50%_50%_50%_50%/40%_40%_60%_60%] border ${b.color} relative`}
            >
              <div className="absolute top-2 left-3 w-2.5 h-5 rounded-full bg-white/35 blur-[1px] rotate-[-25deg]" />
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 rounded-xs ${b.knotColor || 'bg-purple-700/60'}`} />
            </div>
            <div className={`w-[1.5px] h-28 bg-gradient-to-b ${b.stringColor || 'from-purple-400/50 to-transparent'}`} />
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 5. SEAMLESS CAKE CENTERPIECE (Stationary & Crisp) */}
      {/* ========================================================= */}
      <div className="relative z-15 flex flex-col items-center justify-center my-auto w-full max-w-full">
        {/* Ambient Bloom behind the cake */}
        <div
          className={`absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 -z-10 ${
            candlesBlown ? 'bg-purple-900/10 scale-90' : 'bg-purple-600/20 scale-100'
          }`}
        />

        {/* Ambient Floor Reflection & Shadow beneath cake pedestal */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-12 bg-purple-500/25 blur-2xl rounded-[50%] pointer-events-none -z-10" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-80 sm:w-[420px] h-6 bg-black/90 blur-md rounded-[50%] pointer-events-none -z-10" />

        {/* Cake Container: Completely fixed, no shake, no bob */}
        <div className="relative flex items-center justify-center select-none pointer-events-none">
          <div className="relative flex flex-col items-center mt-12 sm:mt-16">
            {/* High-quality crisp cake artwork */}
            <img
              src="/assets/cake_cutout.png"
              alt="Luxury Birthday Cake"
              loading="eager"
              decoding="async"
              className={`h-[38vh] sm:h-[46vh] max-h-[460px] w-auto object-contain transition-all duration-1000 select-none ${
                candlesBlown
                  ? 'brightness-40 opacity-70 filter blur-[1px]'
                  : 'brightness-105 filter drop-shadow-[0_15px_35px_rgba(168,85,247,0.35)]'
              }`}
            />

            {/* Candle Flames & Wicks directly atop the flat top tier */}
            <div className="absolute inset-0 pointer-events-none">
              {CANDLE_CONFIGS.map((candle, idx) => (
                <div
                  key={candle.id}
                  style={{
                    left: candle.left,
                    top: candle.top,
                    transform: 'translate(-50%, -100%)',
                  }}
                  className="absolute flex flex-col items-center"
                >
                  {/* Candle Flame / Smoke Area */}
                  <div className="relative w-6 h-8 flex items-center justify-center">
                    {!candlesBlown ? (
                      <motion.div
                        animate={
                          isBlowingSequence
                            ? { scale: [1, 1.3, 0.4, 0.8, 0], opacity: [1, 0.9, 0.4, 0.2, 0] }
                            : { opacity: 1 }
                        }
                        transition={
                          isBlowingSequence
                            ? { duration: 1.0, ease: "easeOut" }
                            : { opacity: { delay: 0.2 + idx * 0.1, duration: 0.3 } }
                        }
                        className="flame-active relative flex flex-col items-center"
                      >
                        {/* Atmospheric candle aura glow */}
                        <div className="absolute -inset-3 rounded-full bg-purple-500/40 blur-md pointer-events-none" />

                        {/* Outer warm amber flame */}
                        <div className="w-3.5 h-6 rounded-[50%_50%_20%_20%] bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_14px_#f59e0b,0_0_24px_#c084fc]" />

                        {/* Inner white-hot flame core */}
                        <div className="absolute bottom-0.5 w-1.5 h-3 rounded-full bg-white blur-[0.5px]" />
                      </motion.div>
                    ) : (
                      /* Smoke particles rising gracefully when extinguished */
                      <div className="relative flex flex-col items-center">
                        <div className="smoke-particle w-2.5 h-2.5 rounded-full bg-purple-300/60" />
                        <div className="smoke-particle w-3.5 h-3.5 rounded-full bg-purple-400/40 delay-100" />
                      </div>
                    )}
                  </div>

                  {/* Candle Wick */}
                  <div className="w-[1.5px] h-1.5 bg-neutral-900 border-t border-amber-200" />

                  {/* Candle Stick */}
                  <div
                    style={{ height: `${candle.height}px` }}
                    className="w-2.5 rounded-t-sm bg-gradient-to-r from-purple-200 via-white to-purple-300 border border-purple-400/40 shadow-[0_0_8px_rgba(192,132,252,0.4)]"
                  >
                    <div className="w-full h-full bg-gradient-to-b from-transparent via-purple-300/30 to-purple-900/60" />
                  </div>
                </div>
              ))}
            </div>

            {/* Soft floor reflection directly under the cake base */}
            <div className="w-48 sm:w-64 h-4 rounded-full bg-gradient-to-r from-transparent via-purple-400/30 to-transparent blur-sm mt-[-6px] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. CANDLE BLOW INTERACTION & WISH BANNER */}
      {/* ========================================================= */}
      <div className="relative z-25 w-full flex flex-col items-center mt-2">
        <CandleInteraction
          candlesBlown={candlesBlown}
          onBlowSuccess={handleBlowSuccess}
          isBlowingSequence={isBlowingSequence}
          setIsBlowingSequence={setIsBlowingSequence}
        />

        {/* Cinematic Fade into Night Sky after Candle Blowout */}
        <AnimatePresence>
          {candlesBlown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1.2, ease: 'easeInOut' }}
              className="fixed inset-0 z-50 bg-[#020106] pointer-events-none flex flex-col items-center justify-center"
            >
              {/* Emerging purple cosmic dust */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22)_0%,transparent_70%)] animate-pulse" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.0 }}
                className="flex flex-col items-center gap-3 text-center px-6 max-w-lg"
              >
                <div className="flex items-center gap-2 text-purple-300">
                  <Sparkles className="w-4 h-4 text-purple-300 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="text-xs sm:text-sm font-cinzel tracking-[0.4em] uppercase text-purple-200">
                    Close your eyes...
                  </span>
                  <Sparkles className="w-4 h-4 text-purple-300 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <h3 className="font-cormorant italic text-3xl sm:text-5xl text-white font-light tracking-wide leading-tight">
                  Make your biggest wish.
                </h3>
                <p className="font-outfit text-xs sm:text-sm tracking-[0.25em] uppercase text-purple-300/80 font-light mt-1">
                  Some wishes deserve a little magic.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
