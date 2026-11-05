import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'opening', label: 'Welcome', icon: '✦' },
  { id: 'couple', label: 'Couple', icon: '♥' },
  { id: 'invitation', label: 'Invitation', icon: '💌' },
  { id: 'story', label: 'Story', icon: '📖' },
  { id: 'events', label: 'Events', icon: '🌸' },
  { id: 'countdown', label: 'Countdown', icon: '⏳' },
  { id: 'final', label: 'Blessings', icon: '🙏' },
];

export default function FloatingNav({ currentScene = 0 }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      {/* Mobile floating menu button */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-5 z-50 safe-bottom"
            style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            <button
              onClick={() => setOpen((o) => !o)}
              className="touch-target w-12 h-12 rounded-full border flex items-center justify-center shadow-lg cursor-pointer"
              style={{
                background: 'rgba(10,5,5,0.92)',
                borderColor: '#D4A017',
                color: '#D4A017',
                fontSize: '1.1rem',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 20px rgba(212,160,23,0.3)',
              }}
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
            >
              {open ? '✕' : '☰'}
            </button>

            <AnimatePresence>
              {open && (
                <motion.nav
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-16 right-0 rounded-2xl overflow-hidden border shadow-2xl"
                  style={{
                    background: 'rgba(10,5,5,0.95)',
                    borderColor: 'rgba(212,160,23,0.3)',
                    backdropFilter: 'blur(20px)',
                    minWidth: '180px',
                  }}
                  role="menu"
                  aria-label="Page navigation"
                >
                  {NAV_ITEMS.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-white/5 transition-colors touch-target cursor-pointer"
                      style={{
                        color: currentScene === i ? '#FFD700' : 'rgba(247,231,206,0.8)',
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '0.95rem',
                        borderBottom: i < NAV_ITEMS.length - 1 ? '1px solid rgba(212,160,23,0.1)' : 'none',
                      }}
                      role="menuitem"
                    >
                      <span aria-hidden="true">{item.icon}</span>
                      {item.label}
                      {currentScene === i && (
                        <span className="ml-auto text-xs" style={{ color: '#FFD700' }}>✦</span>
                      )}
                    </button>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop dot navigation */}
      <div
        className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3"
        role="navigation"
        aria-label="Section navigation"
      >
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="group relative flex items-center justify-center cursor-pointer"
            aria-label={`Navigate to ${item.label}`}
            title={item.label}
          >
            <span
              className="w-2.5 h-2.5 rounded-full border transition-all duration-300"
              style={{
                background: currentScene === i ? '#FFD700' : 'transparent',
                borderColor: currentScene === i ? '#FFD700' : 'rgba(212,160,23,0.5)',
                boxShadow: currentScene === i ? '0 0 8px #FFD700' : 'none',
                transform: currentScene === i ? 'scale(1.3)' : 'scale(1)',
              }}
            />
            <span
              className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap px-2 py-1 rounded pointer-events-none"
              style={{
                background: 'rgba(10,5,5,0.9)',
                color: '#D4A017',
                border: '1px solid rgba(212,160,23,0.3)',
                fontFamily: 'EB Garamond, serif',
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
