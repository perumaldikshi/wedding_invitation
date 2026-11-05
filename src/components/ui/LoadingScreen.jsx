import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 2800;

    const tick = (now) => {
      const elapsed = now - start;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(Math.floor(p));
      if (p < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 600);
        }, 300);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#0a0505' }}
          role="status"
          aria-label="Loading wedding invitation"
        >
          {/* Om symbol / lotus ornament */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-8"
            aria-hidden="true"
          >
            🪷
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-2xl md:text-4xl mb-2 tracking-widest"
            style={{ color: '#D4A017' }}
          >
            Wedding Invitation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6 }}
            className="text-sm tracking-[0.3em] mb-12"
            style={{ color: '#F7E7CE', fontFamily: 'EB Garamond, serif' }}
          >
            A CELEBRATION OF LOVE
          </motion.p>

          {/* Progress bar */}
          <div className="w-48 md:w-64 h-px relative overflow-hidden" style={{ background: 'rgba(212,160,23,0.2)' }}>
            <motion.div
              className="absolute top-0 left-0 h-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #B8860B, #FFD700, #D4A017)',
                boxShadow: '0 0 8px #FFD700',
              }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.p
            className="mt-4 text-xs tracking-widest"
            style={{ color: 'rgba(212,160,23,0.6)', fontFamily: 'EB Garamond, serif' }}
          >
            {progress}%
          </motion.p>

          {/* Decorative dots */}
          <div className="flex gap-2 mt-8" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#D4A017' }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, delay: i * 0.4, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
