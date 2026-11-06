import { AnimatePresence, motion } from 'framer-motion';
import { Flower2, Music2, RotateCcw, Settings2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TOGGLES = [
  { key: 'petalEffects', label: 'Flower Petal Effects', icon: Flower2 },
  { key: 'music', label: 'Wedding Music', icon: Music2 },
];

export default function ExperienceSettings({ preferences, onChange, onMusicChange, onReplay }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleToggle = (key) => {
    const next = !preferences[key];
    if (key === 'music') onMusicChange(next);
    else onChange(key, next);
  };

  return (
    <div className="experience-settings">
      <motion.button
        type="button"
        className="settings-orb"
        onClick={() => setOpen((value) => !value)}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? 'Close wedding experience settings' : 'Open wedding experience settings'}
        aria-expanded={open}
      >
        {open ? <X size={19} /> : <Settings2 size={19} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.aside
            ref={panelRef}
            className="settings-panel"
            initial={{ opacity: 0, x: -18, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            aria-label="Wedding experience options"
          >
            <div className="settings-heading">
              <span>EXPERIENCE</span>
              <strong>Wedding Settings</strong>
            </div>

            <div className="settings-list">
              {TOGGLES.map(({ key, label, icon: Icon }) => (
                <button key={key} type="button" className="setting-row" onClick={() => handleToggle(key)} aria-pressed={preferences[key]}>
                  <Icon size={16} strokeWidth={1.55} aria-hidden="true" />
                  <span>{label}</span>
                  <i className={`setting-switch ${preferences[key] ? 'is-on' : ''}`} aria-hidden="true"><b /></i>
                </button>
              ))}
            </div>

            <fieldset className="quality-fieldset">
              <legend>3D QUALITY</legend>
              <div className="quality-options">
                {['low', 'medium', 'high'].map((quality) => (
                  <button
                    key={quality}
                    type="button"
                    className={preferences.quality === quality ? 'is-active' : ''}
                    onClick={() => onChange('quality', quality)}
                    aria-pressed={preferences.quality === quality}
                  >
                    {quality}
                  </button>
                ))}
              </div>
              <p>High automatically uses a mobile-safe render cap.</p>
            </fieldset>

            <button
              type="button"
              className="settings-replay"
              onClick={() => { setOpen(false); onReplay(); }}
            >
              <RotateCcw size={15} strokeWidth={1.6} />
              Replay Wedding Animation
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
