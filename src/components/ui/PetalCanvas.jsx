import { useEffect, useRef, useCallback } from 'react';

const PETAL_COLORS = [
  '#FFB7C5', '#FF9EB5', '#FFD700', '#FF8FA0', '#FFC0CB', '#FFE4E1', '#F5D061'
];

class Petal {
  constructor(x, y, canvas) {
    this.reset(x, y, canvas);
  }
  reset(x, y, canvas) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? -20;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = Math.random() * 1.5 + 0.6;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.06;
    this.size = Math.random() * 8 + 6;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.04 + 0.02;
  }
}

export default function PetalCanvas({ active = true, density = 14, className = '' }) {
  const canvasRef = useRef(null);
  const petalsRef = useRef([]);
  const rafRef = useRef(null);
  const touchPetalsRef = useRef([]);
  const lastTouchTime = useRef(0);

  const spawnTouchPetal = useCallback((x, y, count = 3) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    for (let i = 0; i < count; i++) {
      const p = new Petal(x + (Math.random() - 0.5) * 15, y + (Math.random() - 0.5) * 15, canvas);
      p.vy = Math.random() * 2.5 + 0.8;
      p.vx = (Math.random() - 0.5) * 3.5;
      p.size = Math.random() * 7 + 5;
      p.opacity = 0.85;
      touchPetalsRef.current.push(p);
    }
    // Cap touch petals to ensure smooth 60fps on mobile
    if (touchPetalsRef.current.length > 50) {
      touchPetalsRef.current = touchPetalsRef.current.slice(-50);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initial ambient petals
    petalsRef.current = [];
    for (let i = 0; i < density; i++) {
      const p = new Petal(null, null, canvas);
      p.y = Math.random() * canvas.height;
      petalsRef.current.push(p);
    }

    // Window-level touch/pointer listeners without blocking scroll
    const handlePointerDown = (e) => {
      spawnTouchPetal(e.clientX, e.clientY, 5);
      if (navigator.vibrate) {
        try { navigator.vibrate(15); } catch {}
      }
    };

    const handlePointerMove = (e) => {
      const now = performance.now();
      // Throttle trail generation to ~40ms
      if (now - lastTouchTime.current > 40) {
        lastTouchTime.current = now;
        spawnTouchPetal(e.clientX, e.clientY, 1);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const drawPetal = (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      // South Indian jasmine/rose petal oval curve
      ctx.ellipse(0, 0, p.size * 0.45, p.size, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle center vein highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.7);
      ctx.lineTo(0, p.size * 0.7);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ambient petals
      if (active) {
        petalsRef.current.forEach((p) => {
          p.wobble += p.wobbleSpeed;
          p.x += p.vx + Math.sin(p.wobble) * 0.6;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          if (p.y > canvas.height + 25) {
            p.reset(null, null, canvas);
          }
          drawPetal(ctx, p);
        });
      }

      // Touch drag and tap trail petals
      touchPetalsRef.current = touchPetalsRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.016;
        p.vy += 0.04;
        drawPetal(ctx, p);
        return p.opacity > 0;
      });
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      petalsRef.current = [];
      touchPetalsRef.current = [];
    };
  }, [active, density, spawnTouchPetal]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-20 ${className}`}
      aria-hidden="true"
    />
  );
}
