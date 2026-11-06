import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, PerspectiveCamera } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import * as THREE from 'three';
import RoyalDoors from '../three/RoyalDoors';
import GoldenParticles from '../three/GoldenParticles';
import WebGLFallback from '../three/WebGLFallback';
import { useWebGL } from '../../hooks/useWebGL';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import wedding from '../../config/wedding';

function CameraRig({ open }) {
  const { camera, size } = useThree();
  const mobile = size.width / size.height < 0.72;
  const startZ = mobile ? 11.35 : 6.25;

  useEffect(() => {
    if (!open) {
      camera.position.set(0, mobile ? 0.38 : 0.5, startZ);
      camera.lookAt(0, 0.45, 0);
      camera.updateProjectionMatrix();
      return undefined;
    }

    const animation = gsap.to(camera.position, {
      z: -0.75,
      y: 0.28,
      duration: 3.1,
      ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(0, 0.35, -2.5),
    });
    return () => animation.kill();
  }, [camera, mobile, open, startZ]);

  return null;
}

function StudioEnvironment() {
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer intensity={2.2} color="#ffd58a" position={[0, 6, 4]} scale={[9, 2, 1]} />
      <Lightformer intensity={1.4} color="#ff9e45" position={[-5, 1, 3]} rotation={[0, Math.PI / 2, 0]} scale={[5, 2, 1]} />
      <Lightformer intensity={1.4} color="#ff9e45" position={[5, 1, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 2, 1]} />
      <Lightformer intensity={0.8} color="#fff2d8" position={[0, -2, 2]} scale={[5, 1, 1]} />
    </Environment>
  );
}

function SceneReady({ onReady }) {
  useEffect(() => {
    let secondFrame;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => onReady?.());
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [onReady]);

  return null;
}

function Scene3D({ open, quality, onReady }) {
  const particleCount = quality === 'low' ? 65 : quality === 'high' ? 220 : 130;
  const shadowSize = quality === 'high' ? 2048 : quality === 'medium' ? 1024 : 512;
  return (
    <>
      <PerspectiveCamera makeDefault fov={52} near={0.1} far={45} />
      <CameraRig open={open} />
      <ambientLight intensity={0.24} color="#edf1ff" />
      <directionalLight position={[-4, 8, 6]} intensity={1.8} color="#fff1d9" castShadow={quality !== 'low'} shadow-mapSize={[shadowSize, shadowSize]} />
      <spotLight position={[0, 7, 4]} target-position={[0, 0, 0]} intensity={17} distance={18} color="#ffc56b" angle={0.48} penumbra={0.88} castShadow />
      <pointLight position={[-3.8, 0.8, 3]} intensity={3} distance={8} color="#ffd8a3" />
      <pointLight position={[3.8, 0.8, 3]} intensity={3} distance={8} color="#ffd8a3" />
      <StudioEnvironment />
      <GoldenParticles count={particleCount} spread={8} speed={0.22} />
      <RoyalDoors open={open} />
      <SceneReady onReady={onReady} />
      {quality !== 'low' && <ContactShadows position={[0, -1.57, 0.5]} opacity={0.7} scale={10} blur={2.8} far={5.5} color="#160600" />}
      <fog attach="fog" args={['#160806', 14, 32]} />
    </>
  );
}

function MonogramSeal() {
  return (
    <div className="royal-monogram" aria-hidden="true">
      <span>S</span>
      <i />
      <span>G</span>
    </div>
  );
}

export default function OpeningScene({ active = false, onEnter, onDoorOpen, onReady, quality = 'medium' }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('intro');
  const [backdropReady, setBackdropReady] = useState(false);
  const [doorReady, setDoorReady] = useState(false);
  const readyReportedRef = useRef(false);
  const { supported, checked } = useWebGL();
  const reducedMotion = useReducedMotion();

  const handleOpen = useCallback(() => {
    if (phase !== 'intro') return;
    onDoorOpen?.();
    setPhase('opening');
    setOpen(true);
    if (navigator.vibrate) {
      try { navigator.vibrate([18, 35, 18]); } catch { /* vibration is optional */ }
    }
  }, [onDoorOpen, phase]);

  const handleDoorReady = useCallback(() => setDoorReady(true), []);

  useEffect(() => {
    if (!active || phase !== 'intro') return undefined;
    const frame = window.requestAnimationFrame(handleOpen);
    return () => window.cancelAnimationFrame(frame);
  }, [active, handleOpen, phase]);

  useEffect(() => {
    const staticMode = !supported || reducedMotion;
    if (!checked || !backdropReady || (!staticMode && !doorReady) || readyReportedRef.current) return undefined;

    const frame = window.requestAnimationFrame(() => {
      readyReportedRef.current = true;
      onReady?.();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [backdropReady, checked, doorReady, onReady, reducedMotion, supported]);

  useEffect(() => {
    if (!open) return undefined;
    // Continue as soon as the door and camera animation have finished.
    const timer = window.setTimeout(() => {
      setPhase('done');
      onEnter?.();
    }, reducedMotion ? 600 : 3400);
    return () => window.clearTimeout(timer);
  }, [open, onEnter, reducedMotion]);

  if (!checked) return null;

  const staticMode = !supported || reducedMotion;
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
  const effectiveQuality = mobile && quality === 'high' ? 'medium' : quality;
  const dpr = effectiveQuality === 'low' ? [1, 1] : effectiveQuality === 'high' ? [1, 2] : [1, 1.5];

  return (
    <section
      id="opening"
      className={`opening-scene scene-section ${open ? 'is-open' : ''}`}
      aria-label="Royal palace entrance for the wedding invitation"
    >
      <picture className="opening-backdrop-picture">
        <source media="(min-aspect-ratio: 1/1)" srcSet="/assets/mandapam-landscape-4k.jpg" />
        <motion.img
          src="/assets/mandapam-portrait-4k.jpg"
          alt="Detailed golden South Indian wedding mandapam with carved pillars, jasmine garlands and oil lamps"
          className="opening-backdrop"
          width="2560"
          height="3840"
          initial={false}
          animate={{ filter: open ? 'brightness(1) saturate(1)' : 'brightness(.72) saturate(.85)' }}
          transition={{ duration: reducedMotion ? 0 : 2.4 }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setBackdropReady(true)}
          onError={() => setBackdropReady(true)}
        />
      </picture>

      <motion.div
        className="opening-couple-reveal"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 1.4, delay: open && !reducedMotion ? 0.3 : 0 }}
        aria-hidden={!open}
      >
        <span className="opening-reveal-word" aria-hidden="true">Forever</span>
        <img
          src="/assets/wedding-couple-transparent-4k.png"
          srcSet="/assets/wedding-couple-transparent-960.png 960w, /assets/wedding-couple-transparent-1920.png 1920w, /assets/wedding-couple-transparent-4k.png 3840w"
          sizes="100vmin"
          width="3840"
          height="3840"
          alt="Tamil wedding couple holding hands, bride in a red and gold sari and groom in a white and gold veshti"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {staticMode ? (
        <WebGLFallback className={`opening-static absolute inset-0 ${open ? 'is-revealed' : ''}`} />
      ) : (
        <motion.div
          className="opening-canvas"
          aria-hidden="true"
          initial={false}
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.8, delay: open ? 2.6 : 0 }}
        >
          <Canvas
            shadows={effectiveQuality === 'low' ? false : 'soft'}
            dpr={dpr}
            gl={{ antialias: true, powerPreference: 'high-performance', alpha: true, stencil: false }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 0.95;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }}
          >
            <Suspense fallback={null}>
              <Scene3D
                open={open}
                quality={effectiveQuality}
                onReady={handleDoorReady}
              />
            </Suspense>
          </Canvas>
        </motion.div>
      )}

      <div className="cinematic-vignette" aria-hidden="true" />
      <div className="cinematic-grain" aria-hidden="true" />

      <div className="opening-interface">
        <AnimatePresence>
          {phase === 'intro' && (
            <motion.div
              key="intro"
              className="opening-copy"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22, scale: 0.97 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <MonogramSeal />
              <p className="opening-eyebrow">A LOVE LETTER FROM MAILAM</p>
              <h1 className="opening-title">
                <span>{wedding.groomName}</span>
                <em>&amp;</em>
                <span>{wedding.brideName}</span>
              </h1>
              <p className="opening-tamil" lang="ta">{wedding.groomNameTamil} &amp; {wedding.brideNameTamil}</p>
              <div className="opening-rule"><i /></div>
              <p className="opening-date">FRIDAY · 13 NOVEMBER 2026</p>
              <p className="opening-place">MAILAM · TAMIL NADU</p>
            </motion.div>
          )}
        </AnimatePresence>

        {open && (
          <motion.div
            className="opening-reveal-copy"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : 2.6 }}
          >
            <div className="opening-reveal-names">
              <p className="opening-reveal-kicker">WITH LOVE, WE INVITE YOU</p>
              <h1><span>{wedding.groomName}</span><em>&amp;</em><span>{wedding.brideName}</span></h1>
              <p className="opening-reveal-tamil" lang="ta">{wedding.groomNameTamil} &amp; {wedding.brideNameTamil}</p>
            </div>
            <div className="opening-reveal-message">
              <p className="opening-reveal-kicker">OUR BEAUTIFUL BEGINNING</p>
              <h2>A day of love.<br /><em>A lifetime together.</em></h2>
              <p className="opening-reveal-note">Join us as two hearts and two families<br />come together for a lifetime of love.</p>
              <p className="opening-reveal-wedding-date">{wedding.muhurthamDate}</p>
              <p className="opening-reveal-location">Mailam, Tamil Nadu</p>
            </div>
            <a className="opening-reveal-explore" href="#invitation">Explore our invitation <span aria-hidden="true">&#8595;</span></a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
