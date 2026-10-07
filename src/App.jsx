import React, { useState, useEffect } from 'react';
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

export default function App() {
  const [currentStage, setCurrentStage] = useState(1);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(1);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  const {
    isPlaying,
    startAudio,
    togglePlay,
    visualizerBars,
  } = useBirthdayAudio(birthdayData.music);

  // Desktop custom cursor lighting
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const advanceStage = (nextStage) => {
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
    setCurrentStage(1);
    setMaxUnlockedStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-screen w-full bg-[#050507] text-white flex flex-col items-center justify-center overflow-x-hidden">
      {/* Cinematic Particle & Ambient Canvas Background */}
      <ParticleBackground />

      {/* Interactive Cursor Glow on Desktop */}
      <div
        className="fixed w-96 h-96 rounded-full bg-purple-600/5 blur-[80px] pointer-events-none -z-10 transition-transform duration-75 ease-out hidden md:block"
        style={{
          left: `${cursorPos.x - 192}px`,
          top: `${cursorPos.y - 192}px`,
        }}
      />

      {/* Floating Ambient Music Controller */}
      <MusicPlayer
        isPlaying={isPlaying}
        onToggle={togglePlay}
        visualizerBars={visualizerBars}
      />

      {/* Multi-Stage Cinematic Journey */}
      <div className="w-full relative z-10 flex flex-col items-center justify-center">
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
