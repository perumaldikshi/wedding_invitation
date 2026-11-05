import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import GoldenParticles from '../three/GoldenParticles';
import MandapamScene from '../three/MandapamScene';
import OrnamentalDivider from '../ui/OrnamentalDivider';
import { useWebGL } from '../../hooks/useWebGL';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import wedding from '../../config/wedding';

function PhotoPlaceholder({ label, degree, subtitle, native, parents, emoji = '👰', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="relative flex flex-col items-center max-w-[340px] w-full p-6 rounded-2xl royal-glass-card"
    >
      <div className="gold-corner gold-corner-tl" />
      <div className="gold-corner gold-corner-tr" />
      <div className="gold-corner gold-corner-bl" />
      <div className="gold-corner gold-corner-br" />

      {/* Royal Circular Portrait Frame */}
      <div className="relative mb-5">
        <div
          className="w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center border-4 overflow-hidden shadow-2xl relative z-10"
          style={{
            borderColor: '#FFD700',
            background: 'radial-gradient(circle, #2a0b06 0%, #120303 100%)',
            boxShadow: '0 0 35px rgba(255, 215, 0, 0.35)',
          }}
        >
          <span className="text-6xl md:text-7xl select-none" aria-hidden="true">{emoji}</span>
        </div>
        {/* Outer Glowing Concentric Gold Rings */}
        <div
          className="absolute inset-0 rounded-full border border-gold-400/50 pointer-events-none scale-110 animate-pulse"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 rounded-full border border-dashed border-gold-300/40 pointer-events-none scale-120"
          aria-hidden="true"
        />
      </div>

      <h3 className="font-display text-2xl md:text-3xl font-bold text-gold-300 mb-0.5">
        {label} <span className="text-base font-normal text-gold-400/90 font-body">({degree})</span>
      </h3>
      {subtitle && (
        <p className="text-xs font-semibold text-champagne mb-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20">
          {subtitle}
        </p>
      )}

      <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent my-2" />

      <p className="text-xs text-gold-400/90 font-medium mb-1">
        {parents}
      </p>
      <p className="text-[11px] text-champagne/70 text-center">
        {native}
      </p>
    </motion.div>
  );
}

export default function CoupleReveal() {
  const ref = useRef();
  const isInView = useInView(ref, { amount: 0.25, once: true });
  const { supported } = useWebGL();
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="couple"
      ref={ref}
      className="scene-section relative py-24 min-h-screen flex flex-col justify-center items-center"
      style={{ background: 'linear-gradient(180deg, #070303 0%, #170505 50%, #070303 100%)' }}
      aria-label="Couple reveal"
    >
      {/* 3D Mandapam Ambient Depth */}
      {supported && !reducedMotion && (
        <div className="absolute inset-0 opacity-45 pointer-events-none">
          <Canvas gl={{ antialias: false, powerPreference: 'default', alpha: true }}>
            <PerspectiveCamera makeDefault position={[0, 2, 9]} fov={55} />
            <ambientLight intensity={0.4} color="#fff6e8" />
            <pointLight position={[0, 5, 2]} intensity={1.4} color="#FFD700" />
            <pointLight position={[-3, 2, 1]} intensity={0.8} color="#FF7700" />
            <pointLight position={[3, 2, 1]} intensity={0.8} color="#FF7700" />
            <Suspense fallback={null}>
              <MandapamScene />
              <GoldenParticles count={110} spread={7} speed={0.25} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Radiant glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #070303 85%)' }}
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-5xl mx-auto px-4 text-center w-full">
        {/* Heart Monogram Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, type: 'spring' }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gold-400/40 bg-gold-500/10 backdrop-blur-md mb-6 shadow-xl shadow-gold-500/10"
        >
          <span className="text-xl">🪷</span>
          <span className="font-script text-2xl text-gold-300 font-bold tracking-wider">Sridhar &amp; Gowri</span>
          <span className="text-xl">🪷</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="tracking-[0.35em] text-xs uppercase text-gold-400 font-medium mb-2"
        >
          TOGETHER WITH OUR FAMILIES
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="font-display text-3xl md:text-5xl lg:text-6xl text-gold-300 font-bold mb-3 leading-tight"
        >
          We Invite You To Celebrate Our Wedding
        </motion.h2>

        <OrnamentalDivider />

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-base md:text-lg text-champagne/90 max-w-2xl mb-12 font-body"
        >
          With the divine grace of Lord Murugan at Mailam and the blessings of our beloved elders, we step into a lifetime of love and togetherness.
        </motion.p>

        {/* Grand Couple Cards */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 w-full">
          {/* Groom Card */}
          <PhotoPlaceholder
            label={wedding.groomName}
            degree={wedding.groomDegree}
            subtitle={wedding.groomOccupation}
            parents={`S/o. ${wedding.groomParents}`}
            native={wedding.groomNative}
            emoji="🤵"
            delay={0.3}
          />

          {/* Golden Center Heart Emblem */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 180, delay: 0.5 }}
            className="flex flex-col items-center justify-center my-4 md:my-0"
          >
            <div className="w-16 h-16 rounded-full border-2 border-gold-400 bg-maroon/80 flex items-center justify-center shadow-xl shadow-gold-500/25">
              <span className="font-script text-3xl text-gold-300">Weds</span>
            </div>
            <div className="h-10 w-px bg-gold-400/50 mt-2 hidden md:block" />
          </motion.div>

          {/* Bride Card */}
          <PhotoPlaceholder
            label={wedding.brideName}
            degree={wedding.brideDegree}
            subtitle="Bride"
            parents={`D/o. ${wedding.brideParents}`}
            native={wedding.brideNative}
            emoji="👰"
            delay={0.5}
          />
        </div>

        {/* Date & Best Compliments Seal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-14 flex flex-col items-center"
        >
          <div className="px-6 py-2.5 rounded-full border border-gold-400/40 bg-gold-500/10 text-gold-300 font-semibold text-sm md:text-base tracking-wider mb-3">
            ✦ Friday, 13th November 2026 · Mailam ✦
          </div>
          <p className="text-xs tracking-widest text-champagne/70 font-tamil" lang="ta">
            {wedding.complimentsTamil}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
