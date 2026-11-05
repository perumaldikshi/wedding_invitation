import { motion } from 'framer-motion';

export default function AudioControl({ playing, muted, onToggle, onToggleMute, hasMusic }) {
  if (!hasMusic) return null;

  return (
    <div
      className="fixed top-5 right-5 z-50 flex gap-2 items-center"
      style={{ top: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}
    >
      <motion.button
        onClick={onToggle}
        className="touch-target w-11 h-11 rounded-full flex items-center justify-center border"
        style={{
          background: 'rgba(10,5,5,0.85)',
          borderColor: 'rgba(212,160,23,0.4)',
          color: '#D4A017',
          backdropFilter: 'blur(12px)',
          boxShadow: playing ? '0 0 15px rgba(212,160,23,0.3)' : 'none',
        }}
        whileTap={{ scale: 0.9 }}
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={playing ? 'Pause music' : 'Play music'}
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        )}
      </motion.button>

      {playing && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onToggleMute}
          className="touch-target w-9 h-9 rounded-full flex items-center justify-center border"
          style={{
            background: 'rgba(10,5,5,0.85)',
            borderColor: 'rgba(212,160,23,0.3)',
            color: muted ? 'rgba(212,160,23,0.4)' : '#D4A017',
            backdropFilter: 'blur(12px)',
          }}
          whileTap={{ scale: 0.9 }}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
        >
          {muted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 5L6 9H2v6h4l5 4V5zm8.07 2.93L17.66 9.3A5.98 5.98 0 0 1 20 14a5.98 5.98 0 0 1-2.34 4.7l1.41 1.41A7.97 7.97 0 0 0 22 14a7.97 7.97 0 0 0-2.93-6.07zM9.5 9.5L6 6 4.59 7.41 7.17 10H6v4h1.17l-2.76 2.76L5.83 18 11 13.83V9.5L9.5 9.5z"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          )}
        </motion.button>
      )}

      {/* Animated music bars when playing */}
      {playing && !muted && (
        <div className="flex items-end gap-0.5 h-5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: '#D4A017' }}
              animate={{ height: ['40%', '100%', '60%', '80%', '40%'] }}
              transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
