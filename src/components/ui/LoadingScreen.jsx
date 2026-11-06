import { useEffect } from 'react';
import { motion } from 'framer-motion';
export default function LoadingScreen({ onComplete }) {
  useEffect(() => { const timer = window.setTimeout(onComplete, 1500); return () => window.clearTimeout(timer); }, [onComplete]);
  return <div className="journal-loader" role="status" aria-label="Preparing your wedding invitation"><p>A LETTER FROM MAILAM</p><h1>Sridhar <em>&</em> Gowri</h1><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4 }} /><small>A beautiful beginning awaits.</small></div>;
}
