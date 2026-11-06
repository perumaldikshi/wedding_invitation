import { useEffect, useRef } from 'react';
import AOS from 'aos';

let initialized = false;
export function useScrollAnimations(loading) {
  const frameRef = useRef(0);
  useEffect(() => {
    if (loading) return undefined;
    if (!initialized) {
      AOS.init({ duration: 850, easing: 'ease-out-cubic', once: true, offset: 55, mirror: false });
      initialized = true;
    }
    const session = { active: true };
    const refresh = () => {
      if (!session.active) return;
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(() => AOS.refreshHard());
    };
    refresh();
    document.fonts?.ready.then(refresh);
    document.addEventListener('load', refresh, true);
    const resize = new ResizeObserver(refresh);
    resize.observe(document.querySelector('main') || document.body);
    return () => {
      session.active = false;
      window.cancelAnimationFrame(frameRef.current);
      document.removeEventListener('load', refresh, true);
      resize.disconnect();
    };
  }, [loading]);
}
