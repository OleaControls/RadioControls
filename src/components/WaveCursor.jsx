import React, { useRef, useEffect } from 'react';

const WaveCursor = () => {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const isMobile = window.innerWidth < 768;

    const config = {
      lineCount: isMobile ? 22 : 58,
      speed: 0.017,
      amplitude: isMobile ? 42 : 58,
      frequency: 0.0075,
      resolution: isMobile ? 7 : 3,
    };

    /* ─── Particles ─────────────────────────────── */
    const particles = [];
    const MAX_PARTICLES = isMobile ? 18 : 55;

    class Particle {
      constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 1.8;
        this.vy = -(Math.random() * 1.6 + 0.4);
        this.life = 1;
        this.decay = 0.007 + Math.random() * 0.009;
        this.radius = Math.random() * 2.2 + 0.6;
        this.hue = hue + (Math.random() - 0.5) * 40;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.025;
        this.life -= this.decay;
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life * 0.55;
        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 72%)`;
        ctx.fill();
        ctx.restore();
      }
    }

    /* ─── Resize ─────────────────────────────────── */
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    /* ─── Pointer tracking (mouse + touch) ──────── */
    const updatePointer = (x, y) => { pointerRef.current = { x, y }; };
    const onMouseMove = (e) => updatePointer(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      const t = e.touches[0];
      updatePointer(t.clientX, t.clientY);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    /* ─── Main draw loop ─────────────────────────── */
    const draw = () => {
      // Soft trail — dark navy instead of black for brand consistency
      ctx.fillStyle = 'rgba(0, 8, 25, 0.17)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'screen';
      time += config.speed;

      const { width, height } = canvas;
      const ptr = pointerRef.current;

      for (let i = 0; i < config.lineCount; i++) {
        const t = i / (config.lineCount - 1);
        const hue = 175 + t * 108;           // cyan (175) → purple (283)
        const alpha = 0.28 + t * 0.38;
        const lw = 0.8 + t * 2;

        ctx.beginPath();
        ctx.strokeStyle = `hsla(${hue}, 88%, 68%, ${alpha})`;
        ctx.lineWidth = lw;
        ctx.shadowBlur = isMobile ? 6 : 14;
        ctx.shadowColor = `hsla(${hue}, 100%, 65%, 0.9)`;

        const yBase = height * 0.12 + height * 0.76 * t;
        let particleSpawned = false;

        for (let x = 0; x <= width; x += config.resolution) {
          const dx = x - ptr.x;
          const dy = yBase - ptr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const RADIUS = 340;
          let push = 0;
          if (dist < RADIUS) {
            const f = 1 - dist / RADIUS;
            push = f * f * 140;

            if (!particleSpawned && Math.random() < 0.004 && particles.length < MAX_PARTICLES) {
              const wave =
                Math.sin(x * config.frequency + time + i * 0.26) * config.amplitude +
                Math.cos(x * 0.013 + time * 1.35 + i * 0.11) * config.amplitude * 0.38;
              particles.push(new Particle(x, yBase + wave - push, hue));
              particleSpawned = true;
            }
          }

          const wave =
            Math.sin(x * config.frequency + time + i * 0.26) * config.amplitude +
            Math.cos(x * 0.013 + time * 1.35 + i * 0.11) * config.amplitude * 0.38 +
            Math.sin(x * 0.0028 + time * 0.48 + i * 0.05) * config.amplitude * 0.22;

          const y = yBase + wave - push;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      /* ─── Draw particles ─────────────────────── */
      ctx.shadowBlur = 0;
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) particles.splice(i, 1);
        else particles[i].draw(ctx);
      }

      ctx.globalCompositeOperation = 'source-over';
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.88 }}
    />
  );
};

export default WaveCursor;
