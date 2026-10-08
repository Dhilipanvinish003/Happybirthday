import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let isRunning = true;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // Chrome mobile triggers window.resize when address bar expands/contracts during scrolling.
      // Do NOT re-allocate canvas memory if it's only a mobile address bar shift!
      if (Math.abs(newWidth - width) < 5 && Math.abs(newHeight - height) < 140) {
        return;
      }

      width = canvas.width = newWidth;
      height = canvas.height = newHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Track mouse on desktop only without forcing React re-renders
    const handleMouseMove = (e) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Elegant lightweight floating particles (Mobile: 18-20, Desktop: 36-40)
    const particleCount = isMobile
      ? (prefersReducedMotion ? 12 : 20)
      : Math.min(42, Math.floor((width * height) / 35000));

    const colors = [
      'rgba(192, 132, 252, 0.45)', // Neon purple
      'rgba(168, 85, 247, 0.35)', // Bright purple
      'rgba(233, 213, 255, 0.5)',  // Lavender
      'rgba(253, 224, 71, 0.35)',  // Subtle gold dust
    ];

    const particles = [];
    const speedMultiplier = prefersReducedMotion ? 0.5 : 1;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isMobile ? Math.random() * 1.6 + 0.6 : Math.random() * 2.2 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.3 * speedMultiplier,
        vy: (-Math.random() * 0.38 - 0.12) * speedMultiplier, // gently drift upward
        alpha: Math.random() * 0.6 + 0.25,
        pulseSpeed: Math.random() * 0.018 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      if (!isRunning) return;

      time += 0.014;

      // Transparent clear - let underlying CSS background handle radial gradient
      ctx.clearRect(0, 0, width, height);

      // On desktop only: subtle drifting ambient purple orbs and mouse glow
      if (!isMobile) {
        const orb1X = width * 0.25 + Math.sin(time * 0.4) * 45;
        const orb1Y = height * 0.3 + Math.cos(time * 0.35) * 35;
        const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, width * 0.45);
        grad1.addColorStop(0, 'rgba(124, 58, 237, 0.09)');
        grad1.addColorStop(0.5, 'rgba(147, 51, 234, 0.03)');
        grad1.addColorStop(1, 'rgba(5, 5, 7, 0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);

        const orb2X = width * 0.75 + Math.cos(time * 0.5) * 55;
        const orb2Y = height * 0.7 + Math.sin(time * 0.4) * 40;
        const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, width * 0.5);
        grad2.addColorStop(0, 'rgba(192, 132, 252, 0.07)');
        grad2.addColorStop(0.6, 'rgba(22, 11, 38, 0.02)');
        grad2.addColorStop(1, 'rgba(5, 5, 7, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);

        const mouse = mousePosRef.current;
        if (mouse.x > 0 && mouse.y > 0) {
          const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240);
          mouseGrad.addColorStop(0, 'rgba(168, 85, 247, 0.06)');
          mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = mouseGrad;
          ctx.fillRect(0, 0, width, height);
        }
      }

      // Draw floating particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = Math.max(0.12, p.alpha + Math.sin(time * 1.8 + p.pulsePhase) * 0.28);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        if (!isMobile) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(192, 132, 252, 0.7)';
        }
        ctx.fill();
      }

      // Reset context state
      ctx.globalAlpha = 1;
      if (!isMobile) {
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Pause rendering when tab is hidden to save mobile battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050507]"
      style={{ contain: 'strict' }}
    >
      {/* Deep vignette background */}
      <div className="absolute inset-0 bg-[#050507]" />

      {/* Radial soft purple lighting in the center - hardware accelerated CSS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.12)_0%,rgba(11,6,18,0.7)_60%,#050507_100%)] opacity-90" />

      {/* Film grain texture on desktop only (avoid mobile GPU rasterization overhead) */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none hidden md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Optimized Canvas for floating ambient dust */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
      />
    </div>
  );
}
