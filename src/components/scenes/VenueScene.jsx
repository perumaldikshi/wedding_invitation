import { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import MandapamScene from '../three/MandapamScene';
import GoldenParticles from '../three/GoldenParticles';
import WebGLFallback from '../three/WebGLFallback';
import OrnamentalDivider from '../ui/OrnamentalDivider';
import GoldButton from '../ui/GoldButton';
import { useWebGL } from '../../hooks/useWebGL';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import wedding from '../../config/wedding';

const VENUE_HOTSPOTS = [
  {
    id: 'agni',
    label: 'Sacred Agni Kundam',
    titleTamil: 'புனித அக்னி குண்டம்',
    description: 'The sacred fire altar witnessing the Sapthapadi (seven sacred steps) and eternal vows.',
    position: [0, 0.6, -1.5]
  },
  {
    id: 'pillars',
    label: 'Carved Royal Pillars',
    titleTamil: 'சிற்பத் தூண்கள்',
    description: 'Handcrafted Dravidian palace columns adorned with fresh South Indian jasmine (Malli) garlands.',
    position: [-2.9, 1.8, -2]
  },
  {
    id: 'vedika',
    label: 'Kalyana Vedika',
    titleTamil: 'கல்யாண வேதிகை',
    description: 'Elevated royal silk stage where the sacred Mangalsutra / Thali Dharanam is performed.',
    position: [2.5, 0.4, 0]
  }
];

function HotspotMarker({ hotspot, onSelect, isSelected }) {
  return (
    <Html position={hotspot.position} center distanceFactor={10}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(hotspot);
        }}
        className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all border shadow-lg"
        style={{
          background: isSelected ? '#FFD700' : 'rgba(10,5,5,0.85)',
          borderColor: '#FFD700',
          color: isSelected ? '#0a0505' : '#FFD700',
          fontSize: '11px',
          boxShadow: isSelected ? '0 0 16px #FFD700' : '0 0 10px rgba(212,160,23,0.5)',
          transform: isSelected ? 'scale(1.25)' : 'scale(1)',
        }}
        aria-label={`View details about ${hotspot.label}`}
      >
        ✦
      </button>
    </Html>
  );
}

function VenueCanvas3D({ controlsRef, selectedSpot, onSelectSpot }) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      onCreated={({ gl }) => gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))}
      style={{ height: '100%', touchAction: 'none' }}
    >
      <PerspectiveCamera makeDefault position={[0, 2.2, 7]} fov={55} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={3.8}
        maxDistance={11}
        minPolarAngle={Math.PI / 7}
        maxPolarAngle={Math.PI / 1.85}
        enableDamping
        dampingFactor={0.08}
        target={[0, 1.1, 0]}
        rotateSpeed={0.5}
        touches={{ ONE: 1, TWO: 2 }}
      />
      <ambientLight intensity={0.45} color="#fff5e0" />
      <directionalLight position={[5, 8, 5]} intensity={1.3} color="#FFD700" castShadow />
      <pointLight position={[-3, 4, -2]} intensity={0.7} color="#FF8C00" />
      <pointLight position={[3, 4, 2]} intensity={0.5} color="#FFD700" />
      <Suspense fallback={null}>
        <MandapamScene />
        <GoldenParticles count={70} spread={6} speed={0.25} />
        {VENUE_HOTSPOTS.map((spot) => (
          <HotspotMarker
            key={spot.id}
            hotspot={spot}
            isSelected={selectedSpot?.id === spot.id}
            onSelect={onSelectSpot}
          />
        ))}
      </Suspense>
      <fog attach="fog" args={['#0a0505', 9, 24]} />
    </Canvas>
  );
}

export default function VenueScene() {
  const { supported } = useWebGL();
  const reducedMotion = useReducedMotion();
  const controlsRef = useRef(null);
  const [selectedSpot, setSelectedSpot] = useState(VENUE_HOTSPOTS[0]);

  const handleDirections = () => {
    window.open(wedding.mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleResetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 1.1, 0);
    }
  }, []);

  return (
    <section
      id="venue"
      className="scene-section py-20 min-h-screen relative flex flex-col justify-center"
      style={{ background: 'linear-gradient(180deg, #0a0505 0%, #160707 50%, #0a0505 100%)' }}
      aria-label="Wedding venue and mandapam exploration"
    >
      {/* Header */}
      <div className="text-center px-6 mb-8 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="tracking-[0.4em] text-xs mb-3"
          style={{ color: 'rgba(212,160,23,0.6)' }}
        >
          WHERE WE CELEBRATE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl"
          style={{ color: '#FFD700' }}
        >
          The Sacred Venue
        </motion.h2>
        <OrnamentalDivider />
        <p className="text-xs md:text-sm" style={{ color: 'rgba(212,160,23,0.6)' }}>
          Explore the 3D Mandapam · Tap ✦ markers for sacred details
        </p>
      </div>

      {/* 3D Venue Interactive Canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="relative mx-auto rounded-xl overflow-hidden w-[94%] max-w-4xl"
        style={{
          height: 440,
          border: '1px solid rgba(212,160,23,0.35)',
          boxShadow: '0 25px 65px rgba(0,0,0,0.7)',
        }}
      >
        {supported && !reducedMotion ? (
          <>
            <VenueCanvas3D
              controlsRef={controlsRef}
              selectedSpot={selectedSpot}
              onSelectSpot={(spot) => setSelectedSpot((prev) => prev?.id === spot.id ? null : spot)}
            />

            {/* Top-Right Reset View Button */}
            <button
              onClick={handleResetView}
              className="absolute top-4 right-4 z-20 touch-target px-3 py-1.5 rounded-full border text-xs tracking-wider flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-all"
              style={{
                background: 'rgba(10,5,5,0.85)',
                borderColor: 'rgba(212,160,23,0.4)',
                color: '#FFD700',
              }}
              aria-label="Reset 3D camera view"
              title="Reset 3D camera"
            >
              <span>↺</span>
              <span>Reset View</span>
            </button>

            {/* Bottom exploration hint */}
            <div
              className="absolute bottom-3 left-4 text-[11px] tracking-wider px-3 py-1 rounded backdrop-blur-md select-none pointer-events-none"
              style={{
                background: 'rgba(10,5,5,0.75)',
                color: 'rgba(212,160,23,0.7)',
                border: '1px solid rgba(212,160,23,0.2)'
              }}
              aria-hidden="true"
            >
              Touch drag to rotate · Pinch to zoom
            </div>
          </>
        ) : (
          <WebGLFallback className="w-full h-full">
            <div className="text-center px-8">
              <div className="text-5xl mb-4" aria-hidden="true">🏛️</div>
              <p className="font-display text-2xl" style={{ color: '#FFD700' }}>Wedding Mandapam</p>
            </div>
          </WebGLFallback>
        )}
      </motion.div>

      {/* Hotspot details card */}
      <AnimatePresence mode="wait">
        {selectedSpot && (
          <motion.div
            key={selectedSpot.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-xl mx-auto mt-4 px-4 text-center z-10"
          >
            <div
              className="p-4 rounded-lg border backdrop-blur-md relative"
              style={{
                background: 'rgba(26,10,10,0.85)',
                borderColor: 'rgba(212,160,23,0.4)',
              }}
            >
              <h4 className="font-display text-lg text-gold-400 font-semibold mb-0.5">
                ✦ {selectedSpot.label}
              </h4>
              <p className="text-xs text-gold-600 font-tamil mb-1">{selectedSpot.titleTamil}</p>
              <p className="text-xs text-champagne/85 leading-relaxed">{selectedSpot.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Venue Address & Directions Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mt-8 px-4 text-center w-full"
      >
        <div
          className="rounded-xl p-8 relative"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(30,10,10,0.8) 0%, rgba(10,5,5,0.95) 100%)',
            border: '1px solid rgba(212,160,23,0.25)',
            boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Corner traditional marks */}
          {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
            <div key={pos} className={`absolute ${pos} text-sm select-none`} style={{ color: '#D4A017', opacity: 0.5 }} aria-hidden="true">✦</div>
          ))}

          <div className="text-4xl mb-3 select-none" aria-hidden="true">🏛️</div>
          <h3 className="font-display text-2xl md:text-3xl mb-2" style={{ color: '#FFD700' }}>
            {wedding.venueName}
          </h3>
          <p className="text-sm mb-1 text-champagne/80 font-body">
            {wedding.venueAddress}
          </p>
          <p className="text-xs mb-6 text-gold-400/70 tracking-wider">
            {wedding.muhurthamTime}
          </p>

          <GoldButton
            onClick={handleDirections}
            ariaLabel={`Get Google Maps directions to ${wedding.venueName}`}
            icon="📍"
          >
            Get Directions
          </GoldButton>
        </div>
      </motion.div>
    </section>
  );
}
