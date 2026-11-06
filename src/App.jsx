import { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import LoadingScreen from './components/ui/LoadingScreen';
import AudioControl from './components/ui/AudioControl';
import FloatingNav from './components/ui/FloatingNav';
import PetalCanvas from './components/ui/PetalCanvas';
import ExperienceSettings from './components/ui/ExperienceSettings';
import { useAudio } from './hooks/useAudio';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import { useWeddingPreferences } from './hooks/useWeddingPreferences';
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
  const [loading, setLoading] = useState(() => !new URLSearchParams(window.location.search).has('qa'));
  const [openingReady, setOpeningReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [petalActive, setPetalActive] = useState(false);
  const reducedMotion = useReducedMotion();
  const { preferences, updatePreference } = useWeddingPreferences();
  useScrollAnimations(loading);

  // Give the opening artwork and 3D doors the network priority while the
  // loader is visible. Music starts loading once the entrance is ready.
  const audio = useAudio(wedding.backgroundMusic, { enabled: !loading });

  const handleMusicChange = useCallback((enabled) => {
    updatePreference('music', enabled);
    if (enabled) audio.play();
    else audio.pause();
  }, [audio, updatePreference]);

  useEffect(() => {
    if (loading) return undefined;
    let frame;
    const ids = ['opening', 'couple', 'invitation', 'story', 'events', 'countdown', 'final'];
    const track = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = 0;
        ids.forEach((id, index) => {
          if (document.getElementById(id)?.getBoundingClientRect().top <= innerHeight * 0.4) current = index;
        });
        setCurrentScene(current);
      });
    };
    const observer = new MutationObserver(track);
    observer.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', track, { passive: true });
    track();
    return () => { observer.disconnect(); window.removeEventListener('scroll', track); cancelAnimationFrame(frame); };
  }, [loading]);

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

  const handleOpeningReady = useCallback(() => setOpeningReady(true), []);
  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <div
      className="wedding-journal"
    >
      {loading && (
        <LoadingScreen
          ready={openingReady}
          onComplete={handleLoadingComplete}
        />
      )}

      {/* Interactive flower petal canvas */}
      {!reducedMotion && preferences.petalEffects && (
        <PetalCanvas
          active={petalActive && preferences.petalEffects}
          density={preferences.quality === 'low' ? 8 : preferences.quality === 'high' ? 20 : 14}
        />
      )}

      {/* Floating Audio Controls */}
      <AudioControl
        playing={audio.playing}
        muted={audio.muted}
        onToggle={() => handleMusicChange(!audio.playing)}
        onToggleMute={audio.toggleMute}
        blocked={audio.blocked}
        error={audio.error}
      />

      <ExperienceSettings
        preferences={{ ...preferences, music: audio.playing }}
        onChange={updatePreference}
        onMusicChange={handleMusicChange}
        onReplay={handleReplay}
      />

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
          <OpeningScene
            onEnter={handleEnter}
            onReady={handleOpeningReady}
            quality={preferences.quality}
          />
        </Suspense>

        {!loading && (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}
