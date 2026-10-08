import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function MemoryGallery({ data, onNext }) {
  const photos = data?.photos || [];
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <motion.section
      key="memory-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.4, ease: "easeOut" } }}
      className="relative min-h-[92vh] min-h-[92dvh] w-full flex flex-col items-center justify-start px-4 sm:px-6 pt-16 sm:pt-20 pb-20 select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-700/10 blur-[150px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center mb-10 max-w-2xl px-2">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="font-cinzel text-3xl sm:text-5xl font-light text-white tracking-[0.2em] leading-tight uppercase"
        >
          {data?.memoriesTitle || "OUR LITTLE MEMORIES"}
        </motion.h2>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-3 my-3"
        >
          <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-purple-400/60" />
          <span className="text-purple-300 text-sm">♡</span>
          <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-purple-400/60" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="font-cormorant italic text-base sm:text-xl text-purple-200/90 font-light whitespace-pre-line leading-relaxed"
        >
          {data?.memoriesSubtitle || "Some moments become memories. Some memories become treasures."}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-cormorant italic text-sm sm:text-lg text-purple-300/80 font-light mt-1 whitespace-pre-line"
        >
          {data?.memoriesIntro || "These are a few moments I never want to forget."}
        </motion.p>
      </div>

      {/* ========================================================= */}
      {/* 6-CARD CHRONOLOGICAL MEMORIES GRID (Exact Order 01 to 06)  */}
      {/* ========================================================= */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {photos.map((photo, idx) => (
          <motion.div
            key={photo.id || idx}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.15 + idx * 0.1,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -4 }}
            onClick={() => setLightboxIndex(idx)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer bg-[#0e0a1a] border border-purple-500/30 hover:border-purple-400/70 shadow-[0_10px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] transition-all duration-500 flex flex-col"
          >
            {/* Image Container with Full Frame Cover */}
            <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-black flex items-center justify-center">
              <img
                src={photo.url}
                alt={photo.caption}
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "auto"}
                decoding="async"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105 select-none"
              />

              {/* Numbering Badge (01 / 06) */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="px-3 py-1 rounded-full text-xs uppercase tracking-widest bg-black/60 backdrop-blur-md border border-purple-400/40 text-purple-200 font-semibold shadow-sm">
                  {photo.num || `0${idx + 1} / 06`}
                </span>
              </div>

              {/* Lightbox Icon on Hover */}
              <div className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-purple-400/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-200">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Bottom Gradient Overlay for High Contrast Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none opacity-95 group-hover:opacity-90 transition-opacity" />

              {/* Card Caption & Supporting Text */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-center flex flex-col items-center justify-end z-10 pointer-events-none">
                <h3 className="font-cormorant italic text-lg sm:text-xl text-white font-medium leading-snug drop-shadow-md">
                  {photo.caption}
                </h3>

                {photo.supportingText && (
                  <p className="font-cormorant italic text-xs sm:text-sm text-purple-200/85 font-light max-w-xs whitespace-pre-line leading-relaxed mt-1.5 drop-shadow">
                    {photo.supportingText}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* ENDING OF MEMORIES SECTION (Poetic Continuation)           */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-14 sm:mt-18 w-full max-w-2xl px-6 py-8 rounded-3xl bg-purple-950/30 border border-purple-400/25 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.6)] text-center flex flex-col items-center gap-5"
      >
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400/60" />
          <span className="text-xs uppercase tracking-[0.35em] text-purple-300/80 font-medium">
            Our Journey Continues
          </span>
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400/60" />
        </div>

        <div className="space-y-4 font-cormorant leading-relaxed">
          <p className="italic text-xl sm:text-2xl text-purple-100 font-light whitespace-pre-line">
            "And somehow,{"\n"}
            I know these aren't{"\n"}
            our last memories."
          </p>

          <p className="italic text-lg sm:text-xl text-purple-200/90 font-light whitespace-pre-line">
            "There are still so many{"\n"}
            moments waiting for us."
          </p>

          <p className="italic text-lg sm:text-xl text-purple-200/90 font-light whitespace-pre-line">
            "So many places to go.{"\n"}
            So many things to laugh about.{"\n"}
            So many memories left to make."
          </p>

          <p className="italic text-lg sm:text-xl text-purple-200/90 font-light whitespace-pre-line">
            "And I hope one day{"\n"}
            we'll look back at all of this{"\n"}
            and smile."
          </p>

          <div className="pt-2">
            <span className="font-cinzel text-xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 font-semibold drop-shadow-[0_0_20px_rgba(192,132,252,0.6)]">
              This is only one chapter. ❤️
            </span>
          </div>
        </div>

        {/* Continue Button to Next Section */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onNext}
            className="group relative px-8 py-4 rounded-full bg-purple-950/80 border border-purple-400/50 hover:border-purple-300 shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_45px_rgba(192,132,252,0.6)] text-white tracking-widest text-xs sm:text-sm uppercase font-medium transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl flex items-center gap-3"
          >
            <span className="shimmer-text">Listen To My Message</span>
            <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* LIGHTBOX MODAL (Click to View High Res)                    */}
      {/* ========================================================= */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-purple-400/40 text-purple-200 flex items-center justify-center transition-all cursor-pointer z-50"
              aria-label="Close image lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Nav Arrows */}
            <button
              type="button"
              onClick={(e) => {
                e?.stopPropagation();
                setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-purple-950/80 border border-purple-500/40 text-purple-200 flex items-center justify-center transition-all cursor-pointer z-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e?.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % photos.length);
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-purple-950/80 border border-purple-500/40 text-purple-200 flex items-center justify-center transition-all cursor-pointer z-50"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            >
              <div className="relative rounded-2xl overflow-hidden border border-purple-400/50 shadow-[0_0_50px_rgba(168,85,247,0.5)] bg-black">
                <img
                  src={photos[lightboxIndex].url}
                  alt={photos[lightboxIndex].caption}
                  className="max-h-[70vh] max-w-full object-contain rounded-2xl"
                />
              </div>

              <p className="mt-4 text-center font-cinzel text-base sm:text-xl text-purple-100 max-w-xl font-medium">
                {photos[lightboxIndex].caption}
              </p>

              {photos[lightboxIndex].supportingText && (
                <p className="mt-1 text-center font-cormorant italic text-sm sm:text-base text-purple-200/80 max-w-lg whitespace-pre-line">
                  {photos[lightboxIndex].supportingText}
                </p>
              )}

              <span className="text-xs text-purple-400/80 uppercase tracking-widest mt-2 font-medium">
                Memory {String(lightboxIndex + 1).padStart(2, '0')} of {String(photos.length).padStart(2, '0')}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
