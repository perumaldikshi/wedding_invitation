import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Flower2, MailOpen, RotateCcw } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import wedding from '../../config/wedding';

export default function InvitationCard() {
  const [opened, setOpened] = useState(false);
  const reducedMotion = useReducedMotion();
  const letterRef = useRef(null);
  const sealRef = useRef(null);
  const initials = [wedding.groomName, wedding.brideName].map(name => name.trim().split(' ').at(-1)[0]);

  useEffect(() => {
    if (!opened) return undefined;
    const timer = window.setTimeout(() => letterRef.current?.focus({ preventScroll: true }), reducedMotion ? 0 : 1700);
    return () => window.clearTimeout(timer);
  }, [opened, reducedMotion]);

  const closeLetter = () => {
    setOpened(false);
    window.requestAnimationFrame(() => sealRef.current?.focus({ preventScroll: true }));
  };

  return (
    <section id="invitation" className="scene-section letter-invitation" aria-labelledby="letter-section-title">
      <header className="letter-section-header" data-aos="fade-up">
        <p className="letter-section-eyebrow"><Flower2 size={16} aria-hidden="true" /> 02 / A LETTER FOR YOU</p>
        <h2 id="letter-section-title">Something lovely<br /><em>inside.</em></h2>
        <p>{opened ? 'A celebration we would love to share with you.' : 'A little letter. A lifetime of love. Tap the seal to open.'}</p>
      </header>

      <div className={`letter-stage ${opened ? 'is-open' : ''}`}>
        <motion.div
          className="wedding-envelope"
          initial={false}
          animate={{ opacity: opened ? 0 : 1, y: opened ? 90 : 0, scale: opened ? 0.94 : 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.65, delay: opened && !reducedMotion ? 1.05 : 0 }}
          aria-hidden={opened}
        >
          <div className="envelope-back" />
          <motion.div
            className="envelope-letter-peek"
            initial={false}
            animate={{ y: opened ? '-44%' : '0%', opacity: opened ? 1 : 0.65 }}
            transition={{ duration: reducedMotion ? 0 : 0.8, delay: opened && !reducedMotion ? 0.45 : 0 }}
            aria-hidden="true"
          ><Flower2 size={22} /><span>{wedding.groomName} &amp; {wedding.brideName}</span></motion.div>
          <div className="envelope-pocket" aria-hidden="true"><i /><i /><span /></div>
          <motion.div
            className="envelope-flap"
            initial={false}
            animate={{ rotateX: opened ? -180 : 0, zIndex: opened ? 1 : 5 }}
            transition={{ rotateX: { duration: reducedMotion ? 0 : 0.7 }, zIndex: { delay: opened && !reducedMotion ? 0.35 : 0 } }}
            aria-hidden="true"
          />
          <button
            ref={sealRef}
            type="button"
            className="envelope-open-button"
            disabled={opened}
            onClick={() => setOpened(true)}
            aria-expanded={opened}
            aria-controls="wedding-invitation-letter"
            aria-label="Open invitation letter"
          >
            <motion.span
              className="envelope-wax-seal"
              initial={false}
              animate={{ opacity: opened ? 0 : 1, scale: opened ? 0.7 : 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              aria-hidden="true"
            >{initials[0]}<i />{initials[1]}</motion.span>
            <span className="envelope-address">For our dearest family &amp; friends</span>
            <span className="envelope-open-hint"><MailOpen size={15} aria-hidden="true" /> OPEN YOUR LETTER</span>
          </button>
        </motion.div>

        <AnimatePresence>
          {opened && (
            <motion.div
              key="letter"
              className="invitation-letter-wrap"
              initial={reducedMotion ? false : { opacity: 0, y: 110, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, transition: { duration: reducedMotion ? 0 : 0.2 } }}
              transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <article ref={letterRef} id="wedding-invitation-letter" className="invitation-letter" tabIndex={-1} aria-labelledby="letter-couple-names">
                <div className="letter-paper-heading">
                  <Flower2 size={30} strokeWidth={1.25} aria-hidden="true" />
                  <p>TOGETHER WITH OUR FAMILIES</p>
                  <h3 id="letter-couple-names"><span>{wedding.groomName}</span><em>&amp;</em><span>{wedding.brideName}</span></h3>
                  <p className="letter-personal-message">With joyful hearts, we invite you to join us<br /> as we begin our forever.</p>
                </div>

                <motion.div
                  className="letter-unfolded-details"
                  initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 1.2 }}
                >
                  <div className="letter-families">
                    <div><span>THE GROOM</span><strong>{wedding.groomName}</strong><p>{wedding.groomDegree}</p><p>{wedding.groomOccupation}</p><p>S/o. {wedding.groomParents}</p><p>{wedding.groomNative}</p></div>
                    <div><span>THE BRIDE</span><strong>{wedding.brideName}</strong><p>{wedding.brideDegree}</p><p>D/o. {wedding.brideParents}</p><p>{wedding.brideNative}</p></div>
                  </div>
                  <p className="letter-date">{wedding.muhurthamDate}</p>
                  <div className="letter-events">
                    {wedding.events.filter(event => event.enabled).map(event => (
                      <div key={event.id} className="letter-event">
                        <h4>{event.title}</h4>
                        <p className="letter-event-time">{event.time}</p>
                        <p className="letter-event-venue">{event.venue}</p>
                        <p>{event.address}</p>
                        <a href={event.mapUrl} target="_blank" rel="noopener noreferrer">View location <ArrowUpRight size={14} aria-hidden="true" /></a>
                      </div>
                    ))}
                  </div>
                  <p className="letter-closing">Your presence will make our day complete.</p>
                  <p className="letter-signature">With love, Sridhar &amp; Gowri</p>
                  <p className="letter-compliments">{wedding.compliments}</p>
                </motion.div>
              </article>
              <button type="button" className="letter-close-button" onClick={closeLetter}><RotateCcw size={16} aria-hidden="true" /> Fold &amp; close letter</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
