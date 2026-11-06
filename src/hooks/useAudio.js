import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudio(src, { enabled = true, autoStart = true } = {}) {
  const audioRef = useRef(null);
  const wantedRef = useRef(autoStart);
  const startRef = useRef(() => Promise.resolve(false));
  const [state, setState] = useState({ playing: false, muted: false, ready: false, blocked: false, error: null });

  useEffect(() => {
    if (!enabled) return undefined;

    const audio = new Audio(src);
    audioRef.current = audio;
    audio.dataset.weddingAudio = 'true';
    audio.hidden = true;
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';
    audio.autoplay = autoStart;
    document.body.appendChild(audio);
    const session = { disposed: false };
    let lastScrollAttempt = 0;
    const update = patch => { if (!session.disposed) setState(previous => ({ ...previous, ...patch })); };
    const detachUnlock = () => {
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('wheel', unlock, true);
      window.removeEventListener('scroll', unlock, true);
      window.removeEventListener('keydown', unlock, true);
    };
    const attempt = async () => {
      if (session.disposed || !wantedRef.current) return false;
      try {
        await audio.play();
        return !session.disposed && !audio.paused;
      } catch (error) {
        if (!session.disposed && error.name !== 'AbortError') {
          update(error.name === 'NotAllowedError'
            ? { playing: false, blocked: true, error: null }
            : { playing: false, blocked: false, error: 'Music could not load. Tap to retry.' });
        }
        return false;
      }
    };
    function unlock(event) {
      if (event.target?.closest?.('[data-audio-control]') || !wantedRef.current || event.repeat) return;
      if (event.type === 'scroll') {
        const now = performance.now();
        if (now - lastScrollAttempt < 750) return;
        lastScrollAttempt = now;
      }
      void attempt();
    }
    const onPlaying = () => {
      if (!wantedRef.current) { audio.pause(); return; }
      update({ playing: true, blocked: false, error: null });
      detachUnlock();
    };
    const onPause = () => update({ playing: false });
    const onReady = () => update({ ready: true });
    const onVolume = () => update({ muted: audio.muted });
    const onError = () => update({ playing: false, error: 'Music could not load. Tap to retry.' });
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('canplay', onReady);
    audio.addEventListener('volumechange', onVolume);
    audio.addEventListener('error', onError);
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('touchstart', unlock, { capture: true, passive: true });
    window.addEventListener('wheel', unlock, { capture: true, passive: true });
    window.addEventListener('scroll', unlock, { capture: true, passive: true });
    window.addEventListener('keydown', unlock, true);
    startRef.current = attempt;
    if (autoStart) void attempt();
    return () => {
      session.disposed = true;
      detachUnlock();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('canplay', onReady);
      audio.removeEventListener('volumechange', onVolume);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio.remove();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [autoStart, enabled, src]);

  const play = useCallback(() => {
    wantedRef.current = true;
    return startRef.current();
  }, []);
  const pause = useCallback(() => {
    wantedRef.current = false;
    audioRef.current?.pause();
    setState(previous => ({ ...previous, playing: false, blocked: false }));
  }, []);
  const toggleMute = useCallback(() => {
    if (audioRef.current) audioRef.current.muted = !audioRef.current.muted;
  }, []);
  return { ...state, play, pause, toggleMute };
}
