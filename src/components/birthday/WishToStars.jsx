import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, ArrowRight } from 'lucide-react';

/**
 * WishToStars.jsx
 * "MAKE A WISH — SEND IT TO THE STARS ✨"
 * Premium cinematic interactive section following the candle blowout.
 */
export default function WishToStars({ name = "Anisha", onComplete }) {
  // Phase state: 'intro' | 'ready' | 'holding' | 'launching' | 'sent' | 'final'
  const [phase, setPhase] = useState('intro');
  const [introStep, setIntroStep] = useState(1);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const [sentStep, setSentStep] = useState(0);
  const [finalStep, setFinalStep] = useState(0);

  const canvasRef = useRef(null);
  const holdStartRef = useRef(null);
  const holdRafRef = useRef(null);
  const isHoldingRef = useRef(false);
  const phaseRef = useRef('intro');
  phaseRef.current = phase;

  // Track orb position on canvas (screen center)
  const orbPosRef = useRef({ x: 0, y: 0 });

  // Canvas particle / star simulation refs
  const simRef = useRef({
    stars: [],
    dust: [],
    burstParticles: [],
    shootingStar: null,
    finalPulseStar: null,
    flashOpacity: 0,
    pullFactor: 0, // 0 to 1 as hold progress increases
    skyBrightness: 0,
  });

  // -------------------------------------------------------------
  // 1. INTRO TEXT TIMING
  // -------------------------------------------------------------
  useEffect(() => {
    // Step 1: "YOU MADE YOUR WISH..." shows immediately
    const t1 = setTimeout(() => {
      // Step 2: "NOW LET'S SEND IT TO THE UNIVERSE ✨"
      setIntroStep(2);
    }, 1800);

    const t2 = setTimeout(() => {
      // Transition to 'ready' state: orb and hold button emerge
      setPhase('ready');
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // -------------------------------------------------------------
  // 2. CANVAS GALAXY & PARTICLE ENGINE (60 FPS, GPU-friendly)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      orbPosRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.44, // Slightly above center for visual balance with button
      };
      initStars(window.innerWidth, window.innerHeight);
    };

    const initStars = (width, height) => {
      const isMobile = width < 768;
      // Hundreds of deep space stars with varied depths, speeds, and subtle purple/white tints
      const stars = [];
      const starCount = isMobile ? 75 : Math.min(Math.floor((width * height) / 3200), 260);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          origX: Math.random() * width,
          origY: Math.random() * height,
          radius: Math.random() * 1.6 + 0.4,
          baseAlpha: Math.random() * 0.7 + 0.25,
          alpha: 0.5,
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          color: Math.random() > 0.4 ? '#E9D5FF' : Math.random() > 0.5 ? '#C084FC' : '#FFFFFF',
        });
      }

      // Soft purple cosmic dust particles (lightweight on mobile)
      const dust = [];
      const dustCount = isMobile ? 12 : 36;
      for (let i = 0; i < dustCount; i++) {
        dust.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: isMobile ? Math.random() * 35 + 15 : Math.random() * 45 + 20,
          alpha: Math.random() * 0.08 + 0.02,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        });
      }

      simRef.current.stars = stars;
      simRef.current.dust = dust;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    let isRunning = true;

    // Main render loop
    let lastTime = performance.now();
    const render = (time) => {
      if (!isRunning) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const orb = orbPosRef.current;
      const sim = simRef.current;

      ctx.clearRect(0, 0, width, height);

      // Deep space gradient background
      const baseGrad = ctx.createRadialGradient(
        orb.x, orb.y, 40,
        orb.x, orb.y, Math.max(width, height) * 0.85
      );
      baseGrad.addColorStop(0, '#1E0B35');
      baseGrad.addColorStop(0.35, '#120522');
      baseGrad.addColorStop(0.7, '#080314');
      baseGrad.addColorStop(1, '#020106');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Cosmic dust & violet nebula clouds
      for (let i = 0; i < sim.dust.length; i++) {
        const d = sim.dust[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -d.radius) d.x = width + d.radius;
        if (d.x > width + d.radius) d.x = -d.radius;
        if (d.y < -d.radius) d.y = height + d.radius;
        if (d.y > height + d.radius) d.y = -d.radius;

        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
        g.addColorStop(0, `rgba(168, 85, 247, ${d.alpha * (1 + sim.skyBrightness)})`);
        g.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stars render & gravitational physics toward central orb
      for (let i = 0; i < sim.stars.length; i++) {
        const s = sim.stars[i];
        s.twinklePhase += s.twinkleSpeed;
        s.alpha = s.baseAlpha + Math.sin(s.twinklePhase) * 0.3;

        // Normal gentle drift
        s.x += s.vx;
        s.y += s.vy;

        // Gravitational pull toward central orb when user holds
        if (sim.pullFactor > 0) {
          const dx = orb.x - s.x;
          const dy = orb.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = (sim.pullFactor * 180) / Math.max(dist * 0.08, 1);
          s.x += (dx / dist) * speed * dt * 60;
          s.y += (dy / dist) * speed * dt * 60;

          // If star gets pulled right into the orb center, regenerate outward
          if (dist < 25) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.max(width, height) * 0.6;
            s.x = orb.x + Math.cos(angle) * r;
            s.y = orb.y + Math.sin(angle) * r;
          }
        }

        // Screen wraps for ambient stars
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * (1 + sim.pullFactor * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // -------------------------------------------------------------
      // BURST PARTICLES (at 100% Wish Release)
      // -------------------------------------------------------------
      if (sim.burstParticles.length > 0) {
        for (let i = sim.burstParticles.length - 1; i >= 0; i--) {
          const p = sim.burstParticles[i];
          p.x += p.vx * dt * 60;
          p.y += p.vy * dt * 60;
          p.vy -= 0.12; // Curve upwards towards the stars
          p.alpha -= p.decay * dt * 60;
          p.size *= 0.985;

          if (p.alpha <= 0) {
            sim.burstParticles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          if (!isMobile) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#C084FC';
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
          ctx.fill();
          if (!isMobile) {
            ctx.shadowBlur = 0;
          }
        }
        ctx.globalAlpha = 1;
      }

      // -------------------------------------------------------------
      // SHOOTING WISH STAR (Ascending gracefully into the sky)
      // -------------------------------------------------------------
      if (sim.shootingStar) {
        const star = sim.shootingStar;
        star.y -= star.speed * dt * 60;
        star.x += star.vx * dt * 60;
        star.speed *= 1.025; // Accelerate toward the heavens

        // Trail history
        star.trail.unshift({ x: star.x, y: star.y, size: star.size, alpha: 1 });
        if (star.trail.length > 24) star.trail.pop();

        // Draw luminous purple comet trail
        for (let i = 0; i < star.trail.length - 1; i++) {
          const t1 = star.trail[i];
          const t2 = star.trail[i + 1];
          const trailAlpha = (1 - i / star.trail.length) * 0.9;
          const trailWidth = (1 - i / star.trail.length) * star.size * 1.8;

          ctx.strokeStyle = i % 2 === 0 ? '#C084FC' : '#E9D5FF';
          ctx.lineWidth = trailWidth;
          ctx.globalAlpha = trailAlpha;
          if (!isMobile) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#A855F7';
          }
          ctx.beginPath();
          ctx.moveTo(t1.x, t1.y);
          ctx.lineTo(t2.x, t2.y);
          ctx.stroke();
          if (!isMobile) {
            ctx.shadowBlur = 0;
          }
        }

        // Draw brilliant star head
        const starGrad = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3.5
        );
        starGrad.addColorStop(0, '#FFFFFF');
        starGrad.addColorStop(0.3, '#E9D5FF');
        starGrad.addColorStop(0.7, '#A855F7');
        starGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.fillStyle = starGrad;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 4-point star flare
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        const r1 = star.size * 3.8;
        const r2 = star.size * 0.8;
        for (let j = 0; j < 8; j++) {
          const r = j % 2 === 0 ? r1 : r2;
          const a = (j * Math.PI) / 4;
          const fx = star.x + Math.cos(a) * r;
          const fy = star.y + Math.sin(a) * r;
          if (j === 0) ctx.moveTo(fx, fy);
          else ctx.lineTo(fx, fy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // When shooting star leaves top of screen
        if (star.y < -80) {
          sim.shootingStar = null;
          // Trigger 'sent' message stage
          setPhase('sent');
        }
      }

      // -------------------------------------------------------------
      // PULSING STAR (Final State above person's name)
      // -------------------------------------------------------------
      if (sim.finalPulseStar) {
        const fps = sim.finalPulseStar;
        fps.phase += 0.04;
        const scale = 1 + Math.sin(fps.phase) * 0.25;
        const starX = width / 2;
        const starY = height * 0.28;

        ctx.save();
        const g = ctx.createRadialGradient(starX, starY, 0, starX, starY, 24 * scale);
        g.addColorStop(0, '#FFFFFF');
        g.addColorStop(0.35, '#C084FC');
        g.addColorStop(0.75, 'rgba(147, 51, 234, 0.4)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(starX, starY, 24 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Tiny star diamond
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(starX, starY - 9 * scale);
        ctx.lineTo(starX + 2.5 * scale, starY);
        ctx.lineTo(starX, starY + 9 * scale);
        ctx.lineTo(starX - 2.5 * scale, starY);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(starX - 9 * scale, starY);
        ctx.lineTo(starX, starY + 2.5 * scale);
        ctx.lineTo(starX + 9 * scale, starY);
        ctx.lineTo(starX, starY - 2.5 * scale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Screen flash
      if (sim.flashOpacity > 0) {
        ctx.fillStyle = `rgba(192, 132, 252, ${sim.flashOpacity})`;
        ctx.fillRect(0, 0, width, height);
        sim.flashOpacity = Math.max(0, sim.flashOpacity - dt * 2.2);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // -------------------------------------------------------------
  // 3. PRESS & HOLD INTERACTION (Desktop + Touch Mobile)
  // -------------------------------------------------------------
  const HOLD_DURATION = 3000; // 3 seconds

  const startHold = useCallback((e) => {
    // Only allow hold if in 'ready' or 'holding'
    if (phaseRef.current !== 'ready' && phaseRef.current !== 'holding') return;
    if (e) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }

    isHoldingRef.current = true;
    setPhase('holding');
    holdStartRef.current = performance.now() - (holdProgress / 100) * HOLD_DURATION;

    const tick = (now) => {
      if (!isHoldingRef.current) return;
      const elapsed = now - holdStartRef.current;
      const p = Math.min(100, (elapsed / HOLD_DURATION) * 100);

      setHoldProgress(p);
      simRef.current.pullFactor = p / 100;
      simRef.current.skyBrightness = (p / 100) * 0.4;

      if (p >= 100) {
        // Trigger 100% Release Sequence
        isHoldingRef.current = false;
        triggerWishRelease();
      } else {
        holdRafRef.current = requestAnimationFrame(tick);
      }
    };

    holdRafRef.current = requestAnimationFrame(tick);
  }, [holdProgress]);

  const endHold = useCallback(() => {
    if (phaseRef.current === 'launching' || phaseRef.current === 'sent' || phaseRef.current === 'final') return;
    isHoldingRef.current = false;
    if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);

    // Smoothly decay progress back to 0
    let currentP = holdProgress;
    const decay = () => {
      currentP = Math.max(0, currentP - 6);
      setHoldProgress(currentP);
      simRef.current.pullFactor = currentP / 100;
      simRef.current.skyBrightness = (currentP / 100) * 0.4;
      if (currentP > 0 && !isHoldingRef.current) {
        requestAnimationFrame(decay);
      } else if (!isHoldingRef.current) {
        setPhase('ready');
      }
    };
    requestAnimationFrame(decay);
  }, [holdProgress]);

  // -------------------------------------------------------------
  // 4. 100% WISH RELEASE EXPLOSION & ASCENT
  // -------------------------------------------------------------
  const triggerWishRelease = () => {
    setPhase('launching');
    simRef.current.pullFactor = 0;

    // 300ms tension pause, then violent glorious purple burst
    setTimeout(() => {
      const orb = orbPosRef.current;

      // 1. Bright purple flash
      simRef.current.flashOpacity = 0.85;

      // 2. Outward bursting spark particles (scaled appropriately for mobile)
      const burst = [];
      const count = window.innerWidth < 768 ? 65 : 160;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8.5 + 2.5;
        burst.push({
          x: orb.x,
          y: orb.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: Math.random() * 3.8 + 1.2,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.012,
          color: Math.random() > 0.5 ? '#E9D5FF' : Math.random() > 0.3 ? '#C084FC' : '#FFFFFF',
        });
      }
      simRef.current.burstParticles = burst;

      // 3. Glowing wish star rockets into the cosmos
      setTimeout(() => {
        simRef.current.shootingStar = {
          x: orb.x,
          y: orb.y,
          vx: (Math.random() - 0.5) * 0.8,
          speed: 6.5,
          size: 7.5,
          trail: [],
        };
      }, 150);
    }, 320);
  };

  // -------------------------------------------------------------
  // 5. STAGGERED FINAL MESSAGES ('sent' -> 'final')
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase === 'sent') {
      // Step 1: "YOUR WISH HAS BEEN SENT ✨"
      setSentStep(1);

      // Step 2: "NOW LET THE UNIVERSE DO ITS MAGIC."
      const t1 = setTimeout(() => {
        setSentStep(2);
      }, 2200);

      // Step 3: Transition to final emotional greeting
      const t2 = setTimeout(() => {
        setPhase('final');
        simRef.current.finalPulseStar = { phase: 0 };
      }, 5200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'final') {
      setFinalStep(1); // "May this year bring you closer..."
      const t1 = setTimeout(() => setFinalStep(2), 2200); // "HAPPY BIRTHDAY"
      const t2 = setTimeout(() => setFinalStep(3), 3600); // "ANISHA" + special dedication
      const t3 = setTimeout(() => setFinalStep(4), 5200); // Buttons

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [phase]);

  // Restart replay
  const handleReplayMoment = () => {
    simRef.current.finalPulseStar = null;
    simRef.current.shootingStar = null;
    simRef.current.burstParticles = [];
    simRef.current.pullFactor = 0;
    setHoldProgress(0);
    setSentStep(0);
    setFinalStep(0);
    setIntroStep(1);
    setPhase('ready');
  };

  // SVG Circular Ring calculation
  const circleRadius = 52;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <div
      className="relative min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden select-none bg-[#020106] text-white"
      style={{ touchAction: 'none' }} // Prevent scrolling while holding on mobile
    >
      {/* ========================================================= */}
      {/* FULLSCREEN COSMIC GALAXY CANVAS (Hardware Accelerated) */}
      {/* ========================================================= */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Atmospheric ambient vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,1,6,0.85)_100%)] z-1" />

      {/* ========================================================= */}
      {/* PHASE 1: INTRO TEXT ("YOU MADE YOUR WISH...") */}
      {/* ========================================================= */}
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-2xl mx-auto pointer-events-none">
            {introStep >= 1 && (
              <motion.h2
                initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-cinzel text-xl sm:text-2xl md:text-3xl font-light tracking-[0.3em] uppercase text-purple-200/90 drop-shadow-[0_0_20px_rgba(192,132,252,0.6)] mb-3"
              >
                YOU MADE YOUR WISH...
              </motion.h2>
            )}

            {introStep >= 2 && (
              <motion.h1
                initial={{ opacity: 0, y: 25, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-cormorant text-2xl sm:text-4xl md:text-5xl font-semibold italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-300 drop-shadow-[0_0_35px_rgba(192,132,252,0.9)]"
              >
                NOW LET’S SEND IT TO THE UNIVERSE ✨
              </motion.h1>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* PHASE 2 & 3: CENTRAL WISH ORB & HOLD BUTTON */}
      {/* ========================================================= */}
      <AnimatePresence>
        {(phase === 'ready' || phase === 'holding' || phase === 'launching') && (
          <motion.div
            key="interactive-wish-stage"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(15px)', transition: { duration: 0.6 } }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex flex-col items-center justify-center w-full max-w-lg px-4"
          >
            {/* 1. CENTRAL GLOWING WISH ORB */}
            <div className="relative flex items-center justify-center my-6">
              {/* Outer faint celestial ring */}
              <div
                className={`absolute rounded-full border border-purple-400/20 transition-all duration-700 ${
                  phase === 'holding'
                    ? 'w-44 sm:w-56 h-44 sm:h-56 scale-110 border-purple-400/50 shadow-[0_0_40px_rgba(192,132,252,0.4)]'
                    : 'w-36 sm:w-48 h-36 sm:h-48'
                }`}
              />

              {/* Ambient radial glow bloom */}
              <div
                className={`absolute rounded-full blur-2xl transition-all duration-300 pointer-events-none ${
                  phase === 'launching'
                    ? 'w-72 h-72 bg-white scale-150 opacity-100'
                    : phase === 'holding'
                    ? `w-56 h-56 bg-purple-500/${Math.floor(40 + (holdProgress / 100) * 55)} blur-3xl scale-${Math.floor(100 + (holdProgress / 100) * 40)}`
                    : 'w-40 h-40 bg-purple-600/35 animate-pulse'
                }`}
              />

              {/* The magical wish orb body */}
              <motion.div
                animate={
                  phase === 'launching'
                    ? { scale: [1, 1.8, 0], opacity: [1, 1, 0] }
                    : phase === 'holding'
                    ? {
                        scale: 1.05 + (holdProgress / 100) * 0.35,
                        filter: `drop-shadow(0 0 ${25 + (holdProgress / 100) * 45}px #C084FC)`,
                      }
                    : {
                        scale: [1, 1.07, 1],
                        filter: ['drop-shadow(0 0 20px #A855F7)', 'drop-shadow(0 0 35px #C084FC)', 'drop-shadow(0 0 20px #A855F7)'],
                      }
                }
                transition={
                  phase === 'launching'
                    ? { duration: 0.45, ease: 'easeOut' }
                    : phase === 'holding'
                    ? { duration: 0.1 }
                    : { repeat: Infinity, duration: 4.2, ease: 'easeInOut' }
                }
                className="relative w-20 sm:w-26 h-20 sm:h-26 rounded-full flex items-center justify-center cursor-pointer shadow-[inset_0_0_20px_rgba(255,255,255,0.8)]"
                style={{
                  background:
                    'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #E9D5FF 25%, #C084FC 55%, #7C3AED 80%, #3B0764 100%)',
                }}
              >
                {/* Core specular gleam */}
                <div className="absolute top-3 left-4 w-3.5 h-3.5 rounded-full bg-white blur-[0.8px]" />
                <Sparkles className="w-6 h-6 text-white drop-shadow-[0_0_10px_#ffffff] opacity-90 animate-spin" style={{ animationDuration: '12s' }} />
              </motion.div>
            </div>

            {/* 2. INSTRUCTION TEXT */}
            <div className="text-center my-4">
              <span
                className={`font-cinzel text-xs sm:text-sm uppercase tracking-[0.35em] transition-all duration-300 font-medium ${
                  phase === 'holding'
                    ? 'text-purple-200 drop-shadow-[0_0_15px_#C084FC] scale-105'
                    : 'text-purple-300/80'
                }`}
              >
                {phase === 'holding' ? 'Your wish is taking flight...' : 'HOLD TO SEND YOUR WISH'}
              </span>
            </div>

            {/* 3. HOLD BUTTON WITH NEON PROGRESS RING */}
            <div className="relative mt-2 flex items-center justify-center">
              {/* Circular SVG Progress Ring */}
              <svg className="w-32 h-32 -rotate-90 pointer-events-none" viewBox="0 0 120 120">
                {/* Background track */}
                <circle
                  cx="60"
                  cy="60"
                  r={circleRadius}
                  className="stroke-purple-900/40"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                {/* Active neon fill ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={circleRadius}
                  stroke="url(#purpleGlowGradient)"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-75"
                />
                <defs>
                  <linearGradient id="purpleGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E9D5FF" />
                    <stop offset="50%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* The interactive hold button */}
              <button
                type="button"
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                onTouchCancel={endHold}
                aria-label="Hold to send wish"
                className={`absolute w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                  phase === 'holding'
                    ? 'bg-purple-950/80 border-2 border-purple-300 shadow-[0_0_35px_rgba(192,132,252,0.8),inset_0_0_15px_rgba(192,132,252,0.4)]'
                    : 'bg-[#090214]/80 border border-purple-400/40 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:border-purple-300/70 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                }`}
              >
                <Sparkles
                  className={`w-7 h-7 text-purple-200 transition-transform duration-300 ${
                    phase === 'holding' ? 'scale-125 text-white animate-spin' : 'scale-100'
                  }`}
                  style={{ animationDuration: '6s' }}
                />
                <span className="text-[10px] tracking-widest text-purple-300/80 font-cinzel uppercase mt-1">
                  {Math.round(holdProgress)}%
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* PHASE 4: WISH SENT CONFIRMATION MESSAGE */}
      {/* ========================================================= */}
      <AnimatePresence>
        {phase === 'sent' && (
          <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
            {sentStep >= 1 && (
              <motion.h2
                initial={{ opacity: 0, scale: 0.88, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-white to-purple-200 drop-shadow-[0_0_35px_rgba(192,132,252,0.8)] mb-4"
              >
                YOUR WISH HAS BEEN SENT ✨
              </motion.h2>
            )}

            {sentStep >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.2 }}
                className="font-cormorant text-lg sm:text-2xl md:text-3xl italic tracking-wide text-purple-200/80 font-light"
              >
                I hope the universe gives you everything your heart quietly wishes for.
              </motion.p>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* PHASE 5: EMOTIONAL FINAL DEDICATION */}
      {/* ========================================================= */}
      <AnimatePresence>
        {phase === 'final' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex flex-col items-center text-center px-6 max-w-3xl mx-auto my-auto"
          >
            {/* Wish Blessing */}
            {finalStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mb-6"
              >
                <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-white to-purple-200 drop-shadow-[0_0_35px_rgba(192,132,252,0.8)] mb-6">
                  YOUR WISH HAS BEEN SENT ✨
                </h2>
                <p className="font-cormorant text-xl sm:text-2xl md:text-3xl font-light italic text-purple-100/90 leading-relaxed drop-shadow-[0_0_15px_rgba(192,132,252,0.4)]">
                  I hope the universe gives you
                  <br />
                  everything your heart quietly wishes for.
                </p>
              </motion.div>
            )}

            {/* Extra happiness line */}
            {finalStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mb-8"
              >
                <p className="font-cormorant italic text-lg sm:text-2xl text-purple-200/90 font-medium">
                  And maybe... a little extra happiness from me. ❤️
                </p>
              </motion.div>
            )}

            {/* Controls: Replay Moment / Continue */}
            {finalStep >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-4"
              >
                {/* Replay Moment button */}
                <button
                  type="button"
                  onClick={handleReplayMoment}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-purple-300/70 hover:text-white px-5 py-2.5 rounded-full border border-purple-500/30 hover:border-purple-400/60 bg-black/40 hover:bg-purple-950/60 backdrop-blur-md cursor-pointer transition-all duration-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay The Moment</span>
                </button>

                {/* Continue button */}
                {onComplete && (
                  <button
                    type="button"
                    onClick={onComplete}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600/80 to-purple-800/80 hover:from-purple-500 hover:to-purple-700 border border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.5)] cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    <span>There's Something More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
