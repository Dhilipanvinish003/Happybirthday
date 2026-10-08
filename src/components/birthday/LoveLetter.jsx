import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Heart, ArrowRight } from 'lucide-react';

export default function LoveLetter({ data, onNext }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.section
      key="letter-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.4, ease: "easeOut" } }}
      className="relative min-h-[92vh] min-h-[92dvh] w-full flex flex-col items-center justify-start px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none -z-10" />

      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-2 mb-2"
      >
        <Sparkles className="w-4 h-4 text-purple-300" />
        <span className="text-xs uppercase tracking-[0.4em] text-purple-300/80 font-medium">
          A Letter For You
        </span>
        <Sparkles className="w-4 h-4 text-purple-300" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-widest leading-snug uppercase mb-4 max-w-2xl"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-300">
          {data.letterHeading || "THERE'S SOMETHING I WANT TO TELL YOU..."}
        </span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mb-8 max-w-lg"
      >
        <p className="font-cormorant italic text-lg sm:text-xl text-purple-200/80 font-light">
          "{data.letterIntro1 || "I've said many things to you..."}"
        </p>
        <p className="font-cormorant italic text-lg sm:text-xl text-purple-300/90 font-medium mt-1">
          "{data.letterIntro2 || "But there are some things I don't say often enough."}"
        </p>
      </motion.div>

      {/* Envelope / Letter Container */}
      <div className="w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* CLOSED ENVELOPE */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setIsOpen(true)}
              className="group relative mx-auto w-full max-w-md p-8 sm:p-12 rounded-3xl glass-panel border border-purple-400/40 hover:border-purple-300/80 shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] cursor-pointer transition-all duration-500 flex flex-col items-center justify-center gap-5 overflow-hidden"
            >
              {/* Soft purple shine inside */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-purple-900/20 pointer-events-none" />

              {/* Envelope Icon with glow */}
              <div className="relative w-20 h-20 rounded-full bg-purple-950/80 border border-purple-400/50 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(192,132,252,0.8)] transition-all duration-300">
                <Mail className="w-9 h-9 text-purple-200 group-hover:text-white transition-colors" />
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute -top-1 -right-1"
                >
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-500" />
                </motion.div>
              </div>

              <div className="flex flex-col items-center gap-1.5 z-10">
                <span className="font-cinzel text-base sm:text-lg tracking-[0.25em] uppercase text-white font-medium">
                  OPEN MY LETTER 💌
                </span>
                <span className="text-xs text-purple-300/70 tracking-widest uppercase">
                  Tap to unfold what's inside
                </span>
              </div>
            </motion.div>
          ) : (
            /* OPENED LETTER */
            <motion.div
              key="opened-letter"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 sm:p-10 rounded-3xl glass-panel-glow border border-purple-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-left"
            >
              {/* Ambient inner glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Salutation */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="font-cormorant text-xl sm:text-2xl text-purple-200 font-semibold italic mb-5"
              >
                {data.letterGreeting || "To the girl who means more to me than words can explain,"}
              </motion.p>

              {/* Letter Paragraphs */}
              <div className="flex flex-col gap-4 font-cormorant text-lg sm:text-2xl text-purple-100/90 leading-relaxed font-light">
                {(data.letterParagraphs || []).map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: 0.3 + idx * 0.25,
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="whitespace-pre-line"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {/* Signoff */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="mt-8 pt-6 border-t border-purple-500/20 text-right"
              >
                <p className="font-cormorant italic text-base sm:text-xl text-purple-200/90">
                  {data.letterSignoff || "— From someone who is very lucky to have you"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button to proceed once opened */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-12"
        >
          <button
            type="button"
            onClick={onNext}
            className="group relative px-8 py-4 rounded-full bg-purple-950/70 border border-purple-400/50 hover:border-purple-300 shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_45px_rgba(192,132,252,0.6)] text-white tracking-widest text-xs sm:text-sm uppercase font-medium transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl flex items-center gap-3 mx-auto"
          >
            <span className="shimmer-text">Things I Love About You</span>
            <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}
    </motion.section>
  );
}
