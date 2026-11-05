import { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import OrnamentalDivider from '../ui/OrnamentalDivider';
import wedding from '../../config/wedding';

function CardFace({ side, children, style = {} }) {
  return (
    <div
      className="absolute inset-0 rounded-xl"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: side === 'back' ? 'rotateY(180deg)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function InvitationCard() {
  const [flipped, setFlipped] = useState(false);
  const [zoom, setZoom] = useState(1);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const lastTapRef = useRef(0);
  const touchStartRef = useRef(null);
  const pinchStartDistRef = useRef(null);

  const springConfig = { stiffness: 220, damping: 26 };
  const tiltX = useSpring(0, springConfig);
  const tiltY = useSpring(0, springConfig);

  const vibrate = (pattern = 20) => {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch {}
    }
  };

  const handlePointerMove = useCallback((e) => {
    if (reducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.clientX;
    const clientY = e.clientY;

    const nx = (clientX - cx) / (rect.width / 2);
    const ny = (clientY - cy) / (rect.height / 2);
    tiltX.set(Math.max(-14, Math.min(14, ny * -12)));
    tiltY.set(Math.max(-14, Math.min(14, nx * 12)));
  }, [reducedMotion, tiltX, tiltY]);

  const handlePointerLeave = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  // Touch gesture handling: swipe to flip, double tap reset, pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDistRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStartDistRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      const scaleDelta = currentDist / pinchStartDistRef.current;
      setZoom((prev) => Math.max(0.9, Math.min(1.3, prev * (scaleDelta > 1 ? 1.02 : 0.98))));
    } else if (e.touches.length === 1 && touchStartRef.current) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.touches[0].clientX - cx) / (rect.width / 2);
      const ny = (e.touches[0].clientY - cy) / (rect.height / 2);
      tiltX.set(ny * -8);
      tiltY.set(nx * 8);
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current && e.changedTouches.length === 1) {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.time;

      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 400) {
        setFlipped((f) => !f);
        vibrate(30);
      }
    }
    touchStartRef.current = null;
    pinchStartDistRef.current = null;
    tiltX.set(0);
    tiltY.set(0);
  };

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 320) {
      setFlipped(false);
      setZoom(1);
      tiltX.set(0);
      tiltY.set(0);
      vibrate([20, 40, 20]);
    } else {
      setFlipped((f) => !f);
      vibrate(25);
    }
    lastTapRef.current = now;
  }, [tiltX, tiltY]);

  const goldBorder = {
    border: '2px solid rgba(212, 160, 23, 0.7)',
    boxShadow: '0 0 45px rgba(212,160,23,0.22), 0 25px 50px rgba(0,0,0,0.8), inset 0 0 35px rgba(0,0,0,0.4)',
  };

  return (
    <section
      id="invitation"
      className="scene-section flex flex-col items-center justify-center px-4 py-20 min-h-screen relative"
      style={{
        backgroundImage: "linear-gradient(180deg, rgba(8,3,2,.96), rgba(28,8,7,.84), rgba(8,3,2,.97)), url('/assets/palace-mandapam-portrait.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label="3D Invitation card"
    >
      <div className="text-center mb-8 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="tracking-[0.4em] text-xs mb-3"
          style={{ color: 'rgba(212,160,23,0.6)' }}
        >
          ROYAL INVITATION
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl"
          style={{ color: '#FFD700' }}
        >
          Invitation Card
        </motion.h2>
        <OrnamentalDivider />
        <p className="text-xs md:text-sm" style={{ color: 'rgba(212,160,23,0.7)' }}>
          Swipe / Tap to flip · Drag to tilt · Double-tap to reset
        </p>
      </div>

      {/* 3D Card Container */}
      <motion.div
        ref={containerRef}
        style={{
          perspective: 1100,
          width: '100%',
          maxWidth: 440,
          height: 'min(620px, 68svh)',
          cursor: 'pointer',
          rotateX: tiltX,
          rotateY: tiltY,
          scale: zoom,
          touchAction: 'pan-y'
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleTap}
        role="button"
        aria-label={flipped ? 'Invitation card showing ceremony details. Tap to flip back.' : 'Invitation card cover. Tap or swipe to open details.'}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTap(); }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            rotateY: flipped ? 180 : 0,
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* FRONT FACE */}
          <CardFace
            style={{
              backgroundImage: "linear-gradient(rgba(255,246,222,.06), rgba(255,246,222,.06)), url('/assets/ivory-invitation-paper.png')",
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              color: '#4b2819',
              ...goldBorder,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 1.75rem',
            }}
          >
            {/* Embossed corner details */}
            {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos) => (
              <div
                key={pos}
                className={`absolute ${pos} card-corner-detail`}
                aria-hidden="true"
              />
            ))}

            <div
              className="absolute inset-4 rounded-lg pointer-events-none"
              style={{ border: '1px solid rgba(212,160,23,0.3)', boxShadow: 'inset 0 0 15px rgba(212,160,23,0.1)' }}
              aria-hidden="true"
            />

            <div className="invitation-monogram mb-2" aria-hidden="true">S <i /> G</div>

            <p className="tracking-[0.4em] text-[10px] mb-3 uppercase" style={{ color: 'rgba(212,160,23,0.7)' }}>
              Wedding Invitation
            </p>

            <h3
              className="font-display text-3xl md:text-4xl mb-0.5 text-center"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #F7E7CE, #D4A017)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {wedding.groomName} <span className="text-lg font-normal text-gold-400">({wedding.groomDegree})</span>
            </h3>
            <p className="text-[11px] text-champagne/80 mb-2">{wedding.groomOccupation}</p>

            <div className="font-script text-xl my-1" style={{ color: '#9d621c' }}>weds</div>

            <h3
              className="font-display text-3xl md:text-4xl mb-0.5 text-center"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #F7E7CE, #D4A017)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {wedding.brideName} <span className="text-lg font-normal text-gold-400">({wedding.brideDegree})</span>
            </h3>

            <div className="w-24 h-px my-4" style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />

            <p className="text-sm font-semibold tracking-wider mb-1 font-display" style={{ color: '#FFD700' }}>
              13th Friday, November 2026
            </p>

            <p className="text-xs text-center max-w-[280px] text-champagne/80 mb-4">
              Mailam, Tamil Nadu
            </p>

            <div
              className="px-4 py-2 rounded-full border text-[11px] tracking-widest uppercase flex items-center gap-1.5"
              style={{ borderColor: 'rgba(212,160,23,0.4)', background: 'rgba(212,160,23,0.08)', color: '#FFD700' }}
            >
              Tap to Open Full Invitation
            </div>
          </CardFace>

          {/* BACK FACE — Full Details from Physical Card */}
          <CardFace
            side="back"
            style={{
              background: 'radial-gradient(ellipse at center, #8a0b27 0%, #540316 70%, #30010c 100%)',
              ...goldBorder,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1.75rem',
              overflowY: 'auto',
            }}
          >
            {/* Corner ornaments */}
            {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos) => (
              <div key={pos} className={`absolute ${pos} card-corner-detail card-corner-light`} aria-hidden="true" />
            ))}
            <div className="absolute inset-4 rounded-lg pointer-events-none" style={{ border: '1px solid rgba(255,215,0,0.25)' }} aria-hidden="true" />

            <p className="tracking-[0.3em] text-[10px] mb-2 uppercase text-center" style={{ color: 'rgba(255,215,0,0.7)' }}>
              Ceremony Schedule
            </p>

            <h3 className="font-display text-2xl text-center text-gold-300 font-semibold mb-0.5">
              {wedding.groomName} <span className="text-sm font-normal">({wedding.groomDegree})</span>
            </h3>
            <p className="text-[11px] text-champagne/80 mb-0.5">{wedding.groomOccupation}</p>
            <p className="text-[10px] text-gold-400/80 mb-2">{wedding.groomFamily}</p>

            <div className="text-xs my-0.5 text-gold-400 font-script text-xl">weds</div>

            <h3 className="font-display text-2xl text-center text-gold-300 font-semibold mb-0.5">
              {wedding.brideName} <span className="text-sm font-normal">({wedding.brideDegree})</span>
            </h3>
            <p className="text-[10px] text-gold-400/80 mb-3">{wedding.brideFamily}</p>

            <div className="w-full h-px my-2" style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />

            <div className="w-full grid grid-cols-2 gap-3 text-center my-1">
              <div className="p-2 rounded bg-black/30 border border-gold-500/20">
                <p className="text-[9px] uppercase tracking-wider text-gold-400 font-bold">Muhurtham</p>
                <p className="text-[10px] text-champagne font-medium">13th Fri, Nov 2026</p>
                <p className="text-[9px] text-gold-300">6.00 am to 7.30 am</p>
                <p className="text-[8px] text-champagne/70 mt-1">Sri Subramaniya Swamy Sannithi, Mailam</p>
              </div>

              <div className="p-2 rounded bg-black/30 border border-gold-500/20">
                <p className="text-[9px] uppercase tracking-wider text-gold-400 font-bold">Reception</p>
                <p className="text-[10px] text-champagne font-medium">13th Fri, Nov 2026</p>
                <p className="text-[9px] text-gold-300">6.30 pm Onwards</p>
                <p className="text-[8px] text-champagne/70 mt-1">Kasiyammal Thirumana Mandapam, (Pondy Rd) Mailam</p>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-center text-champagne/80 italic">
              Best Compliments from: Friends & Relatives
            </div>

            <p className="mt-3 text-[10px] tracking-wider text-center" style={{ color: 'rgba(255,21