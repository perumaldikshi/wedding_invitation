import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getCountdown, formatCountdownUnit } from '../../utils/countdown';
import OrnamentalDivider from '../ui/OrnamentalDivider';
import wedding from '../../config/wedding';

function CountdownUnit({ value, label }) {
  const prevRef = useRef(value);
  const changed = prevRef.current !== value;
  prevRef.current = value;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded"
        style={{
          background: 'rgba(212,160,23,0.08)',
          border: '1px solid rgba(212,160,23,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <motion.span
          key={value}
          initial={changed ? { y: -20, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-display text-3xl md:text-4xl"
          style={{ color: '#FFD700', textShadow: '0 0 15px rgba(212,160,23,0.4)' }}
          aria-label={`${value} ${label}`}
        >
          {formatCountdownUnit(value)}
        </motion.span>
      </div>
      <span
        className="mt-2 text-xs tracking-widest"
        style={{ color: 'rgba(212,160,23,0.5)' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(() => getCountdown(wedding.weddingDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCountdown(wedding.weddingDate));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="countdown"
      className="scene-section flex flex-col items-center justify-center px-4 py-20 text-center"
      style={{ background: 'linear-gradient(180deg, #0a0505, #1a0808, #0a0505)' }}
      aria-label="Countdown to wedding"
    >
      {/* Decorative rings */}
      {[200, 150, 100].map((size, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            border: `1px solid rgba(212,160,23,${0.05 + i * 0.03})`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `spin ${15 + i * 5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }}
          aria-hidden="true"
        />
      ))}
      <style>{`@keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }`}</style>

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-5xl mb-6"
          aria-hidden="true"
        >
          ⏳
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="tracking-[0.4em] text-xs mb-4"
          style={{ color: 'rgba(212,160,23,0.6)' }}
        >
          THE BIG DAY
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl mb-2"
          style={{ color: '#FFD700' }}
        >
          Counting Down
        </motion.h2>

        <OrnamentalDivider />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm mb-10"
          style={{ color: 'rgba(247,231,206,0.5)' }}
        >
          Until {wedding.muhurthamDate}
        </motion.p>

        {time.passed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4" aria-hidden="true">🎊</div>
            <h3
              className="font-display text-3xl md:text-4xl mb-3"
              style={{ color: '#FFD700' }}
            >
              The Wedding Has Begun!
            </h3>
            <p style={{ color: 'rgba(247,231,206,0.7)' }}>
              Wishing {wedding.groomName} & {wedding.brideName} a lifetime of love and happiness.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="flex items-center justify-center gap-4 md:gap-8"
              role="timer"
              aria-live="off"
            >
              <CountdownUnit value={time.days} label="DAYS" />
              <span className="text-3xl md:text-4xl mb-6" style={{ color: '#D4A017' }}>:</span>
              <CountdownUnit value={time.hours} label="HOURS" />
              <span className="text-3xl md:text-4xl mb-6" style={{ color: '#D4A017' }}>:</span>
              <CountdownUnit value={time.minutes} label="MINUTES" />
              <span className="text-3xl md:text-4xl mb-6" style={{ color: '#D4A017' }}>:</span>
              <CountdownUnit value={time.seconds} label="SECONDS" />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-base italic"
              style={{ color: 'rgba(247,231,206,0.5)', fontFamily: 'EB Garamond, serif' }}
            >
              "And they lived happily ever after…"
            </motion.p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
