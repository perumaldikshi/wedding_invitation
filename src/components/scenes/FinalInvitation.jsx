import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { shareInvitation } from '../../utils/shareInvitation';
import { generateICS } from '../../utils/generateICS';
import OrnamentalDivider from '../ui/OrnamentalDivider';
import GoldButton from '../ui/GoldButton';
import wedding from '../../config/wedding';

function FloatingPetal({ style }) {
  return (
    <div
      className="absolute text-2xl pointer-events-none select-none"
      style={{
        ...style,
        animation: `petalFall ${8 + Math.random() * 6}s linear infinite`,
        animationDelay: `${Math.random() * 8}s`,
      }}
      aria-hidden="true"
    >
      {['🌸', '🌺', '🌹', '🌼'][Math.floor(Math.random() * 4)]}
    </div>
  );
}

export default function FinalInvitation({ onReplay }) {
  const [shareStatus, setShareStatus] = useState(null);
  const [calendarStatus, setCalendarStatus] = useState(null);

  const handleShare = async () => {
    setShareStatus('loading');
    const result = await shareInvitation({
      title: wedding.shareTitle,
      text: wedding.shareText,
      url: wedding.shareUrl,
    });
    if (result.success) {
      setShareStatus(result.method === 'clipboard' ? 'copied' : 'shared');
    } else {
      setShareStatus('error');
    }
    setTimeout(() => setShareStatus(null), 3000);
  };

  const handleCalendar = () => {
    try {
      generateICS(wedding.icsEvent);
      setCalendarStatus('downloaded');
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    } catch {
      setCalendarStatus('error');
    }
    setTimeout(() => setCalendarStatus(null), 3000);
  };

  const petals = Array.from({ length: 12 }, (_, i) => ({
    left: `${(i * 8.3) % 100}%`,
    top: `-${Math.random() * 20}%`,
    fontSize: `${1 + Math.random()}rem`,
    animationDuration: `${8 + Math.random() * 6}s`,
    animationDelay: `${i * 0.7}s`,
  }));

  return (
    <section
      id="final"
      className="scene-section flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0505 0%, #1a0808 40%, #2a0a05 70%, #0a0505 100%)' }}
      aria-label="Final invitation"
    >
      {/* Floating petals */}
      {petals.map((style, i) => (
        <FloatingPetal key={i} style={style} />
      ))}

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center 60%, rgba(212,160,23,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Heart Lotus */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
          className="text-5xl mb-4 select-none"
          aria-hidden="true"
        >
          💖 S + G 💖
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="tracking-[0.4em] text-xs mb-3 uppercase"
          style={{ color: 'rgba(212,160,23,0.6)' }}
        >
          WITH FOLDED HANDS
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-display text-4xl md:text-5xl mb-4 leading-tight"
          style={{ color: '#FFD700', textShadow: '0 0 30px rgba(212,160,23,0.3)' }}
        >
          Your presence is our greatest blessing.
        </motion.h2>

        <OrnamentalDivider />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl font-semibold mb-1"
          style={{ color: '#F7E7CE', fontFamily: 'EB Garamond, serif' }}
        >
          {wedding.groomName} ({wedding.groomDegree}) &amp; {wedding.brideName} ({wedding.brideDegree})
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="text-sm mb-8"
          style={{ color: 'rgba(212,160,23,0.8)' }}
        >
          Friday, 13th November 2026 · Mailam
        </motion.p>

        {/* Final invitation card with Direct Map Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="rounded-xl mb-10 p-6 md:p-8 relative"
          style={{
            background: 'linear-gradient(145deg, #800020, #5c0018)',
            border: '1px solid #D4A017',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,160,23,0.1)',
          }}
        >
          {/* Inner border */}
          <div className="absolute inset-4 rounded pointer-events-none" style={{ border: '1px solid rgba(255,215,0,0.2)' }} aria-hidden="true" />
          {/* Corner marks */}
          {['top-5 left-5', 'top-5 right-5', 'bottom-5 left-5', 'bottom-5 right-5'].map((pos) => (
            <div key={pos} className={`absolute ${pos} text-lg`} style={{ color: '#FFD700', opacity: 0.6 }} aria-hidden="true">✦</div>
          ))}

          <p className="tracking-[0.3em] text-[10px] md:text-xs mb-4 uppercase" style={{ color: 'rgba(255,215,0,0.7)' }}>
            WE REQUEST THE HONOUR OF YOUR PRESENCE
          </p>

          <h3 className="font-display text-2xl md:text-3xl mb-0.5" style={{ color: '#FFD700' }}>
            {wedding.groomName} <span className="text-base font-normal">({wedding.groomDegree})</span>
          </h3>
          <p className="text-xs text-champagne/80 mb-2">{wedding.groomOccupation}</p>

          <div className="text-sm my-1 text-gold-300 font-script text-xl">weds</div>

          <h3 className="font-display text-2xl md:text-3xl mb-0.5" style={{ color: '#FFD700' }}>
            {wedding.brideName} <span className="text-base font-normal">({wedding.brideDegree})</span>
          </h3>

          <div className="w-20 h-px mx-auto my-4" style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left my-4">
            {/* Muhurtham Box */}
            <div className="p-3.5 rounded-lg bg-black/40 border border-gold-500/30 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-gold-400 uppercase tracking-wider">Muhurtham</p>
                <p className="text-sm font-semibold text-champagne">Friday, 13th Nov 2026</p>
                <p className="text-xs text-gold-300 font-medium">6.00 am to 7.30 am</p>
                <p className="text-xs text-champagne/80 mt-1">Sri Subramaniya Swamy Sannithi, Mailam</p>
              </div>
              <a
                href={wedding.muhurthamMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/50 text-gold-300 text-xs font-medium transition-all"
              >
                <span>📍</span> Muhurtham Map Location <span>↗</span>
              </a>
            </div>

            {/* Reception Box */}
            <div className="p-3.5 rounded-lg bg-black/40 border border-gold-500/30 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-gold-400 uppercase tracking-wider">Reception</p>
                <p className="text-sm font-semibold text-champagne">Friday, 13th Nov 2026</p>
                <p className="text-xs text-gold-300 font-medium">6.30 pm Onwards</p>
                <p className="text-xs text-champagne/80 mt-1">Kasiyammal Thirumana Mandapam, (Pondy Road) Mailam</p>
              </div>
              <a
                href={wedding.receptionMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/50 text-gold-300 text-xs font-medium transition-all"
              >
                <span>📍</span> Reception Map Location <span>↗</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {/* Share */}
          <GoldButton
            onClick={handleShare}
            variant="primary"
            ariaLabel="Share this wedding invitation"
            icon={shareStatus === 'copied' ? '✓' : shareStatus === 'shared' ? '✓' : '📤'}
          >
            {shareStatus === 'copied' ? 'Link Copied!' : shareStatus === 'shared' ? 'Shared!' : 'Share Invitation'}
          </GoldButton>

          {/* Add to Calendar */}
          <GoldButton
            onClick={handleCalendar}
            variant="outline"
            ariaLabel="Add wedding to calendar"
            icon={calendarStatus === 'downloaded' ? '✓' : '📅'}
          >
            {calendarStatus === 'downloaded' ? 'Calendar Added!' : 'Add to Calendar'}
          </GoldButton>

          {/* Replay */}
          <GoldButton
            onClick={onReplay}
            variant="ghost"
            ariaLabel="Replay the opening animation"
            icon="↩"
          >
            Replay Opening
          </GoldButton>
        </motion.div>

        {/* Error feedback */}
        {(shareStatus === 'error' || calendarStatus === 'error') && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm"
            style={{ color: '#ff6b6b' }}
            role="alert"
          >
            Something went wrong. Please try again.
          </motion.p>
        )}

        {/* Families details */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-sm text-champagne/80 font-body space-y-1"
        >
          <p className="text-gold-400 font-medium">{wedding.groomFamily}</p>
          <div className="my-1 text-gold-500 text-base">♥</div>
          <p className="text-gold-400 font-medium">{wedding.brideFamily}</p>
          <p className="mt-3 text-xs tracking-wider text-champagne/70 italic">
            ✦ {wedding.compliments} ✦
          </p>
        </motion.div>

        {/* Final mantra */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 }}
          className="mt-10 text-xs tracking-widest text-gold-400/40 font-tamil"
          lang="ta"
        >
          வாழ்க வளமுடன் · May you live in abundance
        </motion.p>
      </div>
    </section>
  );
}
