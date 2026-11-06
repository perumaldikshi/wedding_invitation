import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
const items = [{ id: 'opening', label: 'The entrance' }, { id: 'invitation', label: 'A letter for you' }, { id: 'story', label: 'Our little moments' }, { id: 'events', label: 'The celebrations' }, { id: 'countdown', label: 'Until forever' }, { id: 'final', label: 'See you there' }];
export default function FloatingNav({ currentScene = 0 }) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const escape = event => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, []);
  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' }); setOpen(false); };
  return <>
    <button type="button" className="site-wordmark" onClick={() => go('opening')} aria-label="Back to the entrance">S<span>&</span>G<small>13.11.26</small></button>
    <div className="journey-menu">
      <AnimatePresence>{open && <motion.nav className="journey-menu-panel" id="journey-links" aria-label="Page navigation" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }}>
        <p>THE WEDDING JOURNAL</p>
        {items.map((item, index) => <button key={item.id} type="button" onClick={() => go(item.id)} aria-current={currentScene === index ? 'location' : undefined}><span>{String(index + 1).padStart(2, '0')}</span>{item.label}<ArrowUpRight size={16} /></button>)}
      </motion.nav>}</AnimatePresence>
      <button type="button" className="journey-menu-toggle" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="journey-links" aria-label={open ? 'Close navigation' : 'Explore the invitation'}><span>{String(currentScene + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>{items[currentScene]?.label}{open ? <X size={16} /> : <Menu size={16} />}</button>
    </div>
  </>;
}
