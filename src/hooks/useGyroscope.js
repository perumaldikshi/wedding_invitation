import { useState, useCallback, useRef } from 'react';

export function useGyroscope() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(true);
  const handlerRef = useRef(null);

  const enable = useCallback(async () => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      setSupported(false);
      return;
    }
    // iOS 13+ requires permission
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') { setSupported(false); return; }
      } catch {
        setSupported(false);
        return;
      }
    }
    handlerRef.current = (e) => {
      const x = Math.max(-15, Math.min(15, (e.beta || 0) - 45)) / 15;
      const y = Math.max(-15, Math.min(15, e.gamma || 0)) / 15;
      setTilt({ x, y });
    };
    window.addEventListener('deviceorientation', handlerRef.current);
    setEnabled(true);
  }, []);

  const disable = useCallback(() => {
    if (handlerRef.current) {
      window.removeEventListener('deviceorientation', handlerRef.current);
      handlerRef.current = null;
    }
    setEnabled(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return { tilt, enabled, supported, enable, disable };
}
