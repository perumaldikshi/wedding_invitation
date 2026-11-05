import { useRef, useCallback } from 'react';

export function useSwipe({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50 } = {}) {
  const startRef = useRef(null);

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0];
    startRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (!startRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startRef.current.x;
    const dy = t.clientY - startRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < threshold) return;
    if (absDx > absDy) {
      if (dx > 0) onSwipeRight?.(); else onSwipeLeft?.();
    } else {
      if (dy > 0) onSwipeDown?.(); else onSwipeUp?.();
    }
    startRef.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);

  return { onTouchStart, onTouchEnd };
}

export function useDrag({ onDrag, onDragEnd } = {}) {
  const activeRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e) => {
    activeRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!activeRef.current) return;
    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };
    onDrag?.({ dx, dy, x: e.clientX, y: e.clientY });
  }, [onDrag]);

  const onPointerUp = useCallback(() => {
    activeRef.current = false;
    onDragEnd?.();
  }, [onDragEnd]);

  return { onPointerDown, onPointerMove, onPointerUp };
}
