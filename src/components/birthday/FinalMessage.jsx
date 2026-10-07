import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';

const CONFESSION_LINES = [
  "I know I'm not perfect.",
  "And maybe I'm not always the person you expected me to be.",
  "I know I have my flaws.\nI know there are things I could do better.",
  "But one thing I can promise you...",
  "I will always try my best\nto keep you happy,\nto make you smile,\nto be there for you,\nand to become a better version of myself.",
  "I may not have everything figured out...",
  "But my feelings for you are real.",
  "And whatever happens in the future...",
  "Whatever life brings us...",
  "Let's enjoy every single moment.",
  "Because I never want to lose you."
];

export default function FinalMessage({ data = {}, onReplay }) {
  // 'confession' -> 'final'
  const [stage, setStage] = useState('confession');
  const [confessionIndex, setConfessionIndex] = useState(0);
  const [finalStep, setFinalStep] = useState(1);

  const confessionLines = data?.confessionLines || CONFESSION_LINES;

  // Auto-advance confession lines with cinematic pauses
  useEffect(() => {
    if (stage !== 'confession') return;

    // Longer pause for longer lines
    const currentText = confessionLines[confessionIndex] || "";
    const delay = currentText.length > 50 ? 4200 : 3200;

    const timer = setTimeout(() => {
      if (confessionIndex < confessionLines.length - 1) {
        setConfessionIndex((prev) => prev + 1);
      } else {
        // Transition to the final screen after last confession line
        setStage('final');
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [stage, confessionIndex, confessionLines]);

  // Final screen step reveals with deliberate pauses
  useEffect(() => {
    if (stage !== 'final') return;

    const t1 = setTimeout(() => setFinalStep(2), 2200); // MY LAST HOPE
    const t2 = setTimeout(() => setFinalStep(3), 4400); // MY LAST ENERGY
    const t3 = setTimeout(() => setFinalStep(4), 7000); // Long pause -> IT'S YOU. ❤️
    const t4 = setTimeout(() => setFinalStep(5), 9200); // Happy Birthday, my love + Gratitude + Signature

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [stage]);

  const handleNextConfession = () => {
    if (stage === 'confession') {
      if (confessionIndex < confessionLines.length - 1) {
        setConfessionIndex((prev) => prev + 1);
      } else {
        setStage('final');
      }
    }
  };

  return (
    <motion.section
      key="final-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={stage === 'confession' ? handleNextConfession : undefined}
      className="relative min-h-[92vh] w-full flex flex-col items-center justify-center px-4 sm:px-6 pt-16 pb-12 text-center select-none cursor-pointer sm:cursor-default"
      title={stage === 'confession' ? "Tap anywhere to continue reading" : ""}
    >
      {/* Deep dark backdrop with focused neon center */}
      <div className="absolute inset-0 bg-black/80 -z-20 pointer-events-none" />
      <div className="absolute w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none -z-10" />

      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* STAGE A: THE CINEMATIC CONFESSION (Individual line reveal) */}
        {/* ========================================================= */}
        {stage === 'confession' && (
          <motion.div
            key="confession-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 1.2 } }}
            className="flex flex-col items-center justify-center max-w-2xl mx-auto px-4"
          >
            {/* Header: ONE LAST THING... */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-2 mb-10"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-xs sm:text-sm uppercase tracking-[0.45em] text-purple-300/80 font-medium">
                {data.finalLead || "ONE LAST THING..."}
              </span>
              <Sparkles className="w-4 h-4 text-purple-300" />
            </motion.div>

            {/* Individual Line with Staggered Fade in, slight blur, upward movement */}
            <div className="min-h-[180px] sm:min-h-[220px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={confessionIndex}
                  initial={{ opacity: 0, y: 25, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-xl"
                >
                  <p className="font-cormorant text-2xl sm:text-4xl md:text-5xl italic text-purple-100 font-light leading-relaxed whitespace-pre-line drop-shadow-[0_0_20px_rgba(192,132,252,0.4)]">
                    "{confessionLines[confessionIndex]}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Discrete reading progress indicator */}
            <div className="mt-12 flex items-center gap-1.5 opacity-50">
              {confessionLines.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    idx === confessionIndex
                      ? 'w-6 bg-purple-400'
                      : idx < confessionIndex
                      ? 'w-2 bg-purple-600'
                      : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <p className="mt-4 text-[10px] tracking-[0.25em] uppercase text-purple-300/40">
              Tap anywhere to advance
            </p>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* STAGE B: THE MINIMAL FINAL SCREEN */}
        {/* ========================================================= */}
        {stage === 'final' && (
          <motion.div
            key="final-screen-wrapper"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center max-w-2xl mx-auto px-4 my-auto select-none"
          >
            {/* 3 Pillars revealed sequentially */}
            <div className="flex flex-col items-center gap-4 mb-6">
              {finalStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-cinzel text-base sm:text-xl md:text-2xl tracking-[0.4em] uppercase text-purple-300/80 font-medium">
                    MY LAST LOVE.
                  </span>
                </motion.div>
              )}

              {finalStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-cinzel text-base sm:text-xl md:text-2xl tracking-[0.4em] uppercase text-purple-200/90 font-medium">
                    MY LAST HOPE.
                  </span>
                </motion.div>
              )}

              {finalStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-cinzel text-base sm:text-xl md:text-2xl tracking-[0.4em] uppercase text-purple-100 font-semibold">
                    MY LAST ENERGY.
                  </span>
                </motion.div>
              )}
            </div>

            {/* Final Climax: IT'S YOU. ❤️ (Large, with long pause) */}
            {finalStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 20, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="my-6 flex flex-col items-center"
              >
                <h1 className="font-cinzel text-4xl sm:text-6xl md:text-8xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-pink-100 to-purple-300 drop-shadow-[0_0_50px_rgba(192,132,252,0.9)]">
                  IT'S YOU. ❤️
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="font-cormorant italic text-lg sm:text-2xl text-purple-300/80 font-light tracking-widest mt-2"
                >
                  Always you.
                </motion.p>
              </motion.div>
            )}

            {/* Gratitude & Final Birthday Blessings */}
            {finalStep >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-3 mt-4"
              >
                <p className="font-cormorant text-2xl sm:text-4xl text-white font-normal italic">
                  {data.finalScreenGreeting || "Happy Birthday, my love."}
                </p>

                {/* Heartfelt future message card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="my-2 max-w-lg px-6 py-4 rounded-2xl bg-purple-950/40 border border-purple-400/25 backdrop-blur-md shadow-[0_0_30px_rgba(147,51,234,0.18)]"
                >
                  <p className="font-cormorant italic text-base sm:text-xl text-purple-100/95 font-light leading-relaxed whitespace-pre-line">
                    {data.finalExtraMessage || "And whatever happens in the future...\nWhatever life brings us...\nLet's enjoy every single moment.\nBecause I never want to lose you."}
                  </p>
                </motion.div>

                <p className="font-outfit text-xs sm:text-sm text-purple-200/80 tracking-widest uppercase font-light max-w-md leading-relaxed mt-1">
                  {data.finalScreenGratitude || "Thank you for letting me be a small part of your story."}
                </p>

                {/* Sender Signature */}
                <div className="mt-6 pt-4 border-t border-purple-500/20">
                  <span className="font-cinzel text-xs sm:text-sm tracking-[0.35em] uppercase text-purple-300/90 font-medium">
                    {data.finalSignature || "— With All My Love ❤️"}
                  </span>
                </div>

                {/* Replay Surprise Button */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="mt-8"
                >
                  <button
                    type="button"
                    onClick={onReplay}
                    className="group relative px-7 sm:px-9 py-3 rounded-full bg-black/60 border border-purple-400/30 hover:border-purple-300 text-purple-200 hover:text-white tracking-[0.25em] text-xs uppercase font-medium transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:shadow-[0_0_35px_rgba(192,132,252,0.5)] backdrop-blur-xl flex items-center gap-2.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-purple-300 group-hover:-rotate-90 transition-transform duration-500" />
                    <span className="shimmer-text">
                      {data.replayText || "REPLAY THE SURPRISE"}
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
