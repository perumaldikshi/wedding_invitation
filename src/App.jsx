import { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import LoadingScreen from './components/ui/LoadingScreen';
import AudioControl from './components/ui/AudioControl';
import FloatingNav from './components/ui/FloatingNav';
import PetalCanvas from './components/ui/PetalCanvas';
import { useAudio } from './hooks/useAudio';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useGyroscope } from './hooks/useGyroscope';
import wedding from './config/wedding';

// Lazy-load heavy scenes
const OpeningScene = lazy(() => import('./components/scenes/OpeningScene'));
const CoupleReveal = lazy(() => import('./components/scenes/CoupleReveal'));
const InvitationCard = lazy(() => import('./components/scenes/InvitationCard'));
const OurStory = lazy(() => import('./components/scenes/OurStory'));
const WeddingEvents = lazy(() => import('./components/scenes/WeddingEvents'));
const Countdown = lazy(() => import('./components/scenes/Countdown'));
const FinalInvitation = lazy(() => import('./components/scenes/FinalInvitation'));

// Scene fallback while lazy-loading
function SceneFallback() {
  return (
    <div
      className="flex items-center justify-center min-h-[50vh]"
      style={{ background: '#0a0505' }}
    >
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: '#D4A017',
              animation: `pulse 1.2s ease-in-out ${i * 0.4}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }`}</style>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [entered, setEntered] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [petalActive, setPetalActive] = useState(false);
  const reducedMotion = useReducedMotion();
  const { tilt, enabled: gyroEnabled, supported: gyroSupported, enable: enableGyro, disable: disableGyro } = useGyroscope();

  const audio = useAudio(wedding.backgroundMusic);

  // Track current scene based on scroll
  useEffect(() => {
    if (loading) return;
    const sections = ['opening', 'couple', 'invitation', 'story', 'events', 'countdown', 'final'];
    const observers = sections.map((id, index) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setCurrentScene(index);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, [loading, entered]);

  // Enable petals after entering
  useEffect(() => {
    if (entered && !reducedMotion) {
      const timer = setTimeout(() => setPetalActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, [entered, reducedMotion]);

  const handleEnter = useCallback(() => {
    setEntered(true);
    // Smooth scroll down to couple reveal after opening animation completes
    setTimeout(() => {
      const coupleEl = document.getElementById('couple');
      if (coupleEl) {
        coupleEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  }, []);

  const handleReplay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div
      className="relative min-h-screen bg-palace-bg text-ivory selection:bg-gold-500 selection:text-palace-bg"
      style={{
        transform: gyroEnabled ? `translate3d(${tilt.y * 8}px, ${tilt.x * 8}px, 0)` : undefined,
        transition: 'transform 0.15s ease-out'
      }}
    >
      {/* Interactive flower petal canvas */}
      {!reducedMotion && (
        <PetalCanvas active={petalActive} density={14} />
      )}

      {/* Floating Audio Controls */}
      <AudioControl
        playing={audio.playing}
        muted={audio.muted}
        onToggle={audio.toggle}
        onToggleMute={audio.toggleMute}
        hasMusic={true}
      />

      {/* Mobile Gyroscope Parallax Toggle Button */}
      {gyroSupported && (
        <button
          onClick={gyroEnabled ? disableGyro : enableGyro}
          className="fixed top-5 left-5 z-50 touch-target px-3 py-1.5 rounded-full border text-xs tracking-wider flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-all shadow-lg"
          style={{
            top: 'calc(1.25rem + env(safe-area-inset-top, 0px))',
            background: 'rgba(10,5,5,0.85)',
            borderColor: gyroEnabled ? '#FFD700' : 'rgba(212,160,23,0.3)',
            color: gyroEnabled ? '#FFD700' : 'rgba(247,231,206,0.6)',
            boxShadow: gyroEnabled ? '0 0 15px rgba(255,215,0,0.3)' : 'none'
          }}
          aria-label={gyroEnabled ? 'Disable motion parallax' : 'Enable motion parallax'}
          title="Tilt device for 3D perspective"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="6" y="2" width="12" height="20" rx="2" /><path d="M10 18h4" />
          </svg>
          <span>{gyroEnabled ? '3D Motion On' : '3D Motion'}</span>
        </button>
      )}

      {/* Floating navigation bar with progress indicator */}
      <FloatingNav currentScene={currentScene} />

      {/* Skip to main content accessibility link */}
      <a
        href="#couple"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold-500 focus:text-palace-bg focus:font-display focus:rounded"
      >
        Skip to main content
      </a>

      <main>
        {/* Scene 1: Cinematic Opening */}
        <Suspense fallback={<SceneFallback />}>
          <OpeningScene onEnter={handleEnter} />
        </Suspense>

        {/* Scene 2: Couple Reveal */}
        <Suspense fallback={<SceneFallback />}>
          <CoupleReveal />
        </Suspense>

        {/* Scene 3: Interactive 3D Invitation Card */}
        <Suspense fallback={<SceneFallback />}>
          <InvitationCard />
        </Suspense>

        {/* Scene 4: Our Story Carousel */}
        <Suspense fallback={<SceneFallback />}>
          <OurStory />
        </Suspense>

        {/* Scene 5: Wedding Events */}
        <Suspense fallback={<SceneFallback />}>
          <WeddingEvents />
        </Suspense>

        {/* Scene 6: Live Countdown */}
        <Suspense fallback={<SceneFallback />}>
          <Countdown />
        </Suspense>

        {/* Scene 7: Final Invitation & Blessings */}
        <Suspense fallback={<SceneFallback />}>
          <FinalInvitation onReplay={handleReplay} />
        </Suspense>
      </main>
    </div>
  );
}
