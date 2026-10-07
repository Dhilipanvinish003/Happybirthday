import React, { useEffect, useRef, useState } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Track mouse for interactive ambient purple aura
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Elegant floating particles
    const particleCount = Math.min(45, Math.floor((width * height) / 30000));
    const particles = [];

    const colors = [
      'rgba(192, 132, 252, 0.45)', // Neon purple
      'rgba(168, 85, 247, 0.35)', // Bright purple
      'rgba(233, 213, 255, 0.5)',  // Lavender
      'rgba(253, 224, 71, 0.35)',  // Subtle gold dust
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.15, // gently drift upward
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle slow drifting ambient orbs
      const orb1X = width * 0.25 + Math.sin(time * 0.5) * 60;
      const orb1Y = height * 0.3 + Math.cos(time * 0.4) * 40;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, width * 0.45);
      grad1.addColorStop(0, 'rgba(124, 58, 237, 0.08)');
      grad1.addColorStop(0.5, 'rgba(147, 51, 234, 0.03)');
      grad1.addColorStop(1, 'rgba(5, 5, 7, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const orb2X = width * 0.75 + Math.cos(time * 0.6) * 70;
      const orb2Y = height * 0.7 + Math.sin(time * 0.5) * 50;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, width * 0.5);
      grad2.addColorStop(0, 'rgba(192, 132, 252, 0.06)');
      grad2.addColorStop(0.6, 'rgba(22, 11, 38, 0.02)');
      grad2.addColorStop(1, 'rgba(5, 5, 7, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Mouse interactive aura
      if (mousePos.x > 0 && mousePos.y > 0) {
        const mouseGrad = ctx.createRadialGradient(
          mousePos.x,
          mousePos.y,
          0,
          mousePos.x,
          mousePos.y,
          260
        );
        mouseGrad.addColorStop(0, 'rgba(168, 85, 247, 0.07)');
        mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = Math.max(
          0.1,
          p.alpha + Math.sin(time * 2 + p.pulsePhase) * 0.35
        );

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(192, 132, 252, 0.8)';
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos.x, mousePos.y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep vignette background */}
      <div className="absolute inset-0 bg-[#050507]" />
      
      {/* Radial soft purple lighting in the center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.12)_0%,rgba(11,6,18,0.7)_60%,#050507_100%)] opacity-90" />

      {/* Subtle film grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Canvas for floating orbs and dust */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
