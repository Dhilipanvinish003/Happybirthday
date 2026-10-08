import React, { useState, useEffect, useRef, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { birthdayData } from './data/birthdayData';

import { useBirthdayAudio } from './hooks/useBirthdayAudio';

import ParticleBackground from './components/birthday/ParticleBackground';
import MusicPlayer from './components/birthday/MusicPlayer';
import WelcomeScreen from './components/birthday/WelcomeScreen';
import BalloonScene from './components/birthday/BalloonScene';
import BirthdayCake from './components/birthday/BirthdayCake';
import WishToStars from './components/birthday/WishToStars';
import LoveLetter from './components/birthday/LoveLetter';
import ThingsILove from './components/birthday/ThingsILove';
import MemoryGallery from './components/birthday/MemoryGallery';
import VoiceMessage from './components/birthday/VoiceMessage';
import WishSection from './components/birthday/WishSection';
import FutureSection from './components/birthday/FutureSection';
import FutureMessage from './components/birthday/FutureMessage';
import FinalMessage from './components/birthday/FinalMessage';

// Hardware-accelerated desktop cursor glow without React re-render overhead
const DesktopCursorLighting = memo(function DesktopCursorLighting() {
  const glowRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return;
    const el = glowRef.current;
    if (!el) return;

    let rafId;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const onMove = (e) => {
      targetX = e.clientX - 192;
      targetY = e.clientY - 192;
    };

    const updatePosition = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-96 h-96 rounded-full bg-purple-600/5 blur-[80px] pointer-events-none -z-10 hidden md:block will-change-transform"
      style={{ transform: 'translate3d(-1000px, -1000px, 0)' }}
    />
  );
});

export default function App() {
  const [currentStage, setCurrentStage] = useState(1);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(1);

  const {
    isPlaying,
    startAudio,
    togglePlay,
    setDuckedVolume,
  } = useBirthdayAudio(birthdayData.music);

  // Guarantee that every stage transition immediately scrolls to top
  // Completely prevents mobile black/empty screen gaps when previous stage was scrolled
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentStage]);

  const advanceStage = (nextStage) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentStage(nextStage);
    if (nextStage > maxUnlockedStage) {
      setMaxUnlockedStage(nextStage);
    }
  };

  const handleOpenSurprise = () => {
    startAudio();
    advanceStage(2);
  };

  const handleReplay = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentStage(1);
    setMaxUnlockedStage(1);
  };

  return (
    <main className="relative min-h-screen min-h-[100dvh] w-full bg-[#050507] text-white flex flex-col items-center justify-start overflow-x-hidden">
      {/* Cinematic Particle & Ambient Canvas Background */}
      <ParticleBackground />

      {/* Zero re-render Desktop Cursor Lighting */}
      <DesktopCursorLighting />

      {/* Floating Ambient Music Controller */}
      <MusicPlayer
        isPlaying={isPlaying}
        onToggle={togglePlay}
      />

      {/* Multi-Stage Cinematic Journey */}
      <div className="w-full relative z-10 flex flex-col items-center justify-start flex-grow">
        <AnimatePresence mode="wait">
          {/* Section 1: Opening */}
          {currentStage === 1 && (
            <WelcomeScreen
              key="welcome"
              data={birthdayData}
              onOpenSurprise={handleOpenSurprise}
            />
          )}

          {/* Section 2: Balloon / Intro */}
          {currentStage === 2 && (
            <BalloonScene
              key="balloons"
              data={birthdayData}
              onComplete={() => advanceStage(3)}
            />
          )}

          {/* Section 3: Cake */}
          {currentStage === 3 && (
            <BirthdayCake
              key="cake"
              data={birthdayData}
              onComplete={() => advanceStage(4)}
              setDuckedVolume={setDuckedVolume}
            />
          )}

          {/* Section 4: Wish to Stars */}
          {currentStage === 4 && (
            <WishToStars
              key="wish-stars"
              name={birthdayData.name || "Anisha"}
              onComplete={() => advanceStage(5)}
            />
          )}

          {/* Section 5: Love Letter */}
          {currentStage === 5 && (
            <LoveLetter
              key="letter"
              data={birthdayData}
              onNext={() => advanceStage(6)}
            />
          )}

          {/* Section 6: Things I Love About You */}
          {currentStage === 6 && (
            <ThingsILove
              key="things-i-love"
              data={birthdayData}
              onNext={() => advanceStage(7)}
            />
          )}

          {/* Section 7: Memories / Photos */}
          {currentStage === 7 && (
            <MemoryGallery
              key="memories"
              data={birthdayData}
              onNext={() => advanceStage(8)}
            />
          )}

          {/* Section 8: Voice / Audio */}
          {currentStage === 8 && (
            <VoiceMessage
              key="voice"
              data={birthdayData}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              startAudio={startAudio}
              onNext={() => advanceStage(9)}
            />
          )}

          {/* Section 9: Four Wishes */}
          {currentStage === 9 && (
            <WishSection
              key="wishes"
              data={birthdayData}
              onNext={() => advanceStage(10)}
            />
          )}

          {/* Section 10: Future */}
          {currentStage === 10 && (
            <FutureSection
              key="future"
              data={birthdayData}
              onNext={() => advanceStage(11)}
            />
          )}

          {/* Section 11: Future Message */}
          {currentStage === 11 && (
            <FutureMessage
              key="future-message"
              data={birthdayData}
              onNext={() => advanceStage(12)}
            />
          )}

          {/* Section 12: Final Love Message & Final Screen */}
          {currentStage === 12 && (
            <FinalMessage
              key="final"
              data={birthdayData}
              onReplay={handleReplay}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
