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

function Scene3D({ open, onOpenComplete }) {
  return (
    <>
      <PerspectiveCamera makeDefault fov={52} near={0.1} far={45} />
      <CameraRig open={open} />
      <ambientLight intensity={0.55} color="#ffe8c1" />
      <directionalLight position={[-4, 8, 6]} intensity={2.7} color="#ffe5ad" castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[0, 7, 4]} target-position={[0, 0, 0]} intensity={34} distance={18} color="#ffc56b" angle={0.48} penumbra={0.88} castShadow />
      <pointLight position={[-3.8, 0.8, 3]} intensity={10} distance={8} color="#ff8a31" />
      <pointLight position={[3.8, 0.8, 3]} intensity={10} distance={8} color="#ff8a31" />
      <StudioEnvironment />
      <GoldenParticles count={150} spread={8} speed={0.22} />
      <RoyalDoors open={open} onOpenComplete={onOpenComplete} />
      <ContactShadows position={[0, -1.57, 0.5]} opacity={0.7} scale={10} blur={2.8} far={5.5} color="#160600" />
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

export default function OpeningScene({ onEnter }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('intro');
  const { supported, checked } = useWebGL();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const gestureStartRef = useRef(null);

  const handleOpen = useCallback(() => {
    if (phase !== 'intro') return;
    setPhase('opening');
    setOpen(true);
    if (navigator.vibrate) {
      try { navigator.vibrate([18, 35, 18]); } catch { /* vibration is optional */ }
    }
  }, [phase]);

  const handleOpenComplete = useCallback(() => {
    window.setTimeout(() => {
      setPhase('done');
      onEnter?.();
    }, 520);
  }, [onEnter]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse') return;
      gestureStartRef.current = { x: event.clientX, y: event.clientY, time: performance.now() };
    };
    const onPointerUp = (event) => {
      const start = gestureStartRef.current;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25 && performance.now() - start.time < 750) handleOpen();
      gestureStartRef.current = null;
    };

    element.addEventListener('pointerdown', onPointerDown, { passive: true });
    element.addEventListener('pointerup', onPointerUp, { passive: true });
    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointerup', onPointerUp);
    };
  }, [handleOpen]);

  if (!checked) return null;

  const staticMode = !supported || reducedMotion;

  return (
    <section
      id="opening"
      ref={containerRef}
      onClick={handleOpen}
      className={`opening-scene scene-section ${open ? 'is-open' : ''}`}
      aria-label="Interactive royal palace entrance for the wedding invitation"
    >
      <motion.img
        src="/assets/palace-mandapam-portrait.jpg"
        alt="Illuminated South Indian wedding mandapam framed by a flower-covered palace arch"
        className="opening-backdrop"
        initial={false}
        animate={{ scale: open ? 1.1 : 1.01, filter: open ? 'brightness(1.05) saturate(1.08)' : 'brightness(.58) saturate(.88)' }}
        transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
        loading="eager"
        fetchPriority="high"
      />

      {staticMode ? (
        <WebGLFallback className="absolute inset-0" />
      ) : (
        <div className="opening-canvas" aria-hidden="true">
          <Canvas
            shadows="soft"
            dpr={[1, 1.75]}
            gl={{ antialias: true, powerPreference: 'high-performance', alpha: true, stencil: false }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.08;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }}
          >
            <Suspense fallback={null}>
              <Scene3D open={open} onOpenComplete={handleOpenComplete} />
            </Suspense>
          </Canvas>
        </div>
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
              <p className="opening-eyebrow">TOGETHER WITH OUR FAMILIES</p>
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

        <AnimatePresence>
          {phase === 'intro' && (
            <motion.div
              className="opening-action"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ delay: 0.35, duration: 0.75 }}
            >
              <button
                type="button"
                className="door-open-button"
                onClick={(event) => { event.stopPropagation(); handleOpen(); }}
                aria-label="Open the palace doors and enter the wedding invitation"
              >
                <span className="tap-mark" aria-hidden="true"><i /><i /><i /></span>
                <span><strong>Tap to Open</strong><small>our royal invitation</small></span>
              </button>
              <p>Tap the gates or swipe sideways</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'opening' && (
            <motion.div
              className="opening-welcome"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.96, 1, 1, 1.03] }}
              transition={{ duration: 2.8, times: [0, 0.2, 0.72, 1] }}
              role="status"
            >
              <span>THE GATES OPEN</span>
              <strong>Welcome to our celebration</strong>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
