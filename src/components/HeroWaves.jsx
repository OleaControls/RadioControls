import React, { useRef, useEffect } from 'react';

/**
 * CyberSilkWaves Component
 * High-end aesthetic: Ultra-thin glowing lines with organic, silk-like movement.
 * Replaces aggressive waves with elegant, premium-audio inspired fluidity.
 */
const HeroWaves = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parentSection = container.closest('section');
    if (parentSection) {
      parentSection.addEventListener('mousemove', handleMouseMove);
      parentSection.addEventListener('mouseleave', handleMouseLeave);
    }

    // Elegant Parallel Strings Configuration (DAW Style)
    const lineCount = 10;
    const colors = ['#00f3ff', '#bc13fe', '#ffffff', '#00f3ff', '#bc13fe'];

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);
      time += 0.025; // Adjusted speed for a more balanced and elegant flow

      const spacing = height / (lineCount + 1);

      for (let i = 0; i < lineCount; i++) {
        const color = colors[i % colors.length];
        const yBase = spacing * (i + 1);
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        // Flickering/Pulsing effect - More dynamic
        const flicker = 0.1 + Math.pow(Math.sin(time * 1.5 + i), 2) * 0.4;
        ctx.globalAlpha = flicker;

        ctx.moveTo(0, yBase);

        for (let x = 0; x <= width; x += 8) {
          // More complex organic movement (sum of sines)
          let wave1 = Math.sin(x * 0.0015 + time + i) * 35;
          let wave2 = Math.sin(x * 0.003 - time * 0.5 + i * 2) * 15;
          let yOffset = wave1 + wave2;

          // Mouse Interaction: High-Responsive Magnetic Flow
          if (mouseRef.current.active) {
            const dx = x - mouseRef.current.x;
            const dy = yBase - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 350; // Larger influence area

            if (dist < radius) {
              const power = Math.pow(1 - dist / radius, 2);
              // Warp lines towards mouse
              yOffset += (mouseRef.current.y - yBase) * power * 1.2;
              // High frequency vibration/jitter near mouse
              yOffset += Math.sin(time * 15 + x * 0.2) * 8 * power;
            }
          }

          ctx.lineTo(x, yBase + yOffset);
        }

        // Technical Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (parentSection) {
        parentSection.removeEventListener('mousemove', handleMouseMove);
        parentSection.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default HeroWaves;
