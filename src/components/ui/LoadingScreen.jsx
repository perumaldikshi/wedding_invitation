import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
export default function LoadingScreen({ ready, onComplete }) {
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumElapsed(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready || !minimumElapsed || completedRef.current) return undefined;
    const frame = window.requestAnimationFrame(() => {
      completedRef.current = true;
      onComplete();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [minimumElapsed, onComplete, ready]);

  // Never trap visitors on the loader if a GPU or asset fails unexpectedly.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return <div className="journal-loader" role="status" aria-label="Preparing your wedding invitation"><p>A LETTER FROM MAILAM</p><h1>Sridhar <em>&</em> Gowri</h1><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4 }} /><small>A beautiful beginning awaits.</small></div>;
}
