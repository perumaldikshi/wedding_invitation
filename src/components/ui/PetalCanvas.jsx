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
    this.sprite = Math.floor(Math.random() * 4);
    this.depth = 0.55 + Math.random() * 0.9;
    this.tumble = Math.random() * Math.PI * 2;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.04 + 0.02;
  }
}

export default function PetalCanvas({ active = true, peacockActive = false, density = 14, className = '' }) {
  const canvasRef = useRef(null);
  const petalsRef = useRef([]);
  const rafRef = useRef(null);
  const touchPetalsRef = useRef([]);
  const featherParticlesRef = useRef([]);
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
    if (!ctx) return;
    const flowerAtlas = new Image();
    flowerAtlas.src = '/assets/real-flower-sprites.png';
    let lastFrame = 0;

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

    featherParticlesRef.current = Array.from({ length: 7 }, (_, index) => ({
      x: ((index * 0.137 + 0.08) % 1) * canvas.width,
      y: ((index * 0.271 + 0.04) % 1) * canvas.height,
      vy: 0.22 + (index % 3) * 0.08,
      sway: index * 1.7,
      rotation: index * 0.73,
      scale: 0.72 + (index % 4) * 0.1,
    }));

    // Window-level touch/pointer listeners without blocking scroll
    const handlePointerDown = (e) => {
      if (!active) return;
      spawnTouchPetal(e.clientX, e.clientY, 5);
      if (navigator.vibrate) {
        try { navigator.vibrate(15); } catch {}
      }
    };

    const handlePointerMove = (e) => {
      if (!active) return;
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
      // Perspective foreshortening lets the photographed petals turn edge-on.
      const width = p.size * 3.2 * p.depth;
      ctx.scale(Math.max(0.16, Math.abs(Math.cos(p.tumble))), 1);
      if (flowerAtlas.complete && flowerAtlas.naturalWidth > 0) {
        const cellWidth = flowerAtlas.naturalWidth / 2;
        const cellHeight = flowerAtlas.naturalHeight / 2;
        ctx.drawImage(flowerAtlas, (p.sprite % 2) * cellWidth,
          Math.floor(p.sprite / 2) * cellHeight, cellWidth, cellHeight,
          -width / 2, -width / 2, width, width);
      }

      ctx.restore();
    };

    const drawFeather = (ctx, feather) => {
      ctx.save();
      ctx.translate(feather.x, feather.y);
      ctx.rotate(feather.rotation);
      ctx.scale(feather.scale, feather.scale);
      ctx.globalAlpha = 0.52;
      const gradient = ctx.createLinearGradient(0, -18, 0, 18);
      gradient.addColorStop(0, '#187b78');
      gradient.addColorStop(0.55, '#0a5e64');
      gradient.addColorStop(1, '#b99136');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, 5.2, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c59a35';
      ctx.beginPath();
      ctx.ellipse(0, -6, 3.2, 5.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#193b80';
      ctx.beginPath();
      ctx.ellipse(0, -6, 1.8, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(217,178,85,.65)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(0, 25);
      ctx.stroke();
      ctx.restore();
    };

    const animate = (timestamp = 0) => {
      const step = lastFrame ? Math.min((timestamp - lastFrame) / 16.667, 2) : 1;
      lastFrame = timestamp;
      rafRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ambient petals
      if (active) {
        petalsRef.current.forEach((p) => {
          p.wobble += p.wobbleSpeed * step;
          p.tumble += 0.018 * step;
          p.x += (p.vx + Math.sin(p.wobble) * 0.6) * step;
          p.y += p.vy * p.depth * step;
          p.rotation += p.rotationSpeed * step;
          if (p.y > canvas.height + 25) {
            p.reset(null, null, canvas);
          }
          drawPetal(ctx, p);
        });
      }

      if (peacockActive) {
        featherParticlesRef.current.forEach((feather) => {
          feather.sway += 0.012;
          feather.x += Math.sin(feather.sway) * 0.18;
          feather.y += feather.vy;
          feather.rotation += 0.0025;
          if (feather.y > canvas.height + 35) feather.y = -35;
          drawFeather(ctx, feather);
        });
      }

      // Touch drag and tap trail petals
      touchPetalsRef.current = touchPetalsRef.current.filter((p) => {
        p.x += p.vx * step;
        p.tumble += 0.03 * step;
        p.y += p.vy * p.depth * step;
        p.rotation += p.rotationSpeed * step;
        p.opacity -= 0.009 * step;
        p.vy += 0.025 * step;
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
      featherParticlesRef.current = [];
    };
  }, [active, density, peacockActive, spawnTouchPetal]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-20 ${className}`}
      aria-hidden="true"
    />
  );
}
