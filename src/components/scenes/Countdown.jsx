import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Sparkle } from 'lucide-react';
import { getCountdown, formatCountdownUnit } from '../../utils/countdown';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import wedding from '../../config/wedding';
function Unit({ value, label, reduced }) {
  return <div className="forever-unit"><div className="forever-digit"><AnimatePresence mode="popLayout" initial={false}><motion.span key={value} initial={reduced ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? {} : { y: -12, opacity: 0 }} transition={{ duration: 0.22 }}>{formatCountdownUnit(value)}</motion.span></AnimatePresence></div><span>{label}</span></div>;
}
export default function Countdown() {
  const [time, setTime] = useState(() => getCountdown(wedding.weddingDate));
  const reduced = useReducedMotion();
  useEffect(() => { const timer = setInterval(() => setTime(getCountdown(wedding.weddingDate)), 1000); return () => clearInterval(timer); }, []);
  return <section id="countdown" className="scene-section forever-countdown" aria-labelledby="forever-title">
    <div className="journal-section-index" data-aos="fade-up"><span>05 / UNTIL FOREVER</span><span>13 NOVEMBER 2026</span></div>
    <div className="forever-layout"><div data-aos="fade-up"><motion.div className="forever-star" animate={reduced ? {} : { rotate: 360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }} aria-hidden="true"><Sparkle size={66} strokeWidth={0.8} /></motion.div><h2 id="forever-title">Every second,<br /><em>closer to you.</em></h2><p>{time.passed ? 'The day we have been waiting for is here.' : 'The next chapter is almost here. And you are part of it.'}</p></div>
      <div className="forever-clock-side" data-aos="fade-up" data-aos-delay="100">{time.passed ? <div className="forever-arrived"><span>IT IS OUR WEDDING DAY</span><strong>Let the celebrations begin.</strong></div> : <div className="forever-clock" role="timer" aria-live="off" aria-label="Time until the wedding"><Unit value={time.days} label="DAYS" reduced={reduced} /><Unit value={time.hours} label="HOURS" reduced={reduced} /><Unit value={time.minutes} label="MINUTES" reduced={reduced} /><Unit value={time.seconds} label="SECONDS" reduced={reduced} /></div>}<p>Friday, 13 November 2026 <span>06:00 AM IST</span></p><a href="#final" className="journal-text-link">Save a little space in your calendar <ArrowUpRight size={17} /></a></div>
    </div>
  </section>;
}
