import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';


export default function MusicPlayer({ isPlaying, onToggle, visualizerBars = [30, 60, 45, 80] }) {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
      <motion.button
        type="button"
        onClick={onToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-2.5 px-3.5 py-3 rounded-full glass-panel-glow border border-purple-400/40 text-purple-200 hover:text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all duration-300"
        aria-label={isPlaying ? "Pause music" : "Play music"}
        title={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
      >
        {/* Pulsing glow ring when playing */}
        {isPlaying && (
          <motion.div
            className="absolute -inset-1 rounded-full border border-purple-400/40 pointer-events-none"
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        )}

        <div className="relative flex items-center justify-center">
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-purple-300 animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-purple-400/70" />
          )}
        </div>

        {/* Visualizer bars */}
        <div className="flex items-end gap-0.5 h-4 w-5 justify-center overflow-hidden">
          {visualizerBars.map((height, i) => (
            <motion.span
              key={i}
              className="w-1 bg-gradient-to-t from-purple-500 to-purple-300 rounded-full"
              animate={{
                height: isPlaying ? `${Math.max(15, height)}%` : '20%',
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>

        <span className="hidden sm:inline text-xs font-medium tracking-wider uppercase text-purple-200/90 pl-0.5">
          {isPlaying ? "Music On" : "Music Off"}
        </span>
      </motion.button>
    </div>
  );
}
