import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CalendarPlus, Check, RotateCcw, Share2 } from 'lucide-react';
import { shareInvitation } from '../../utils/shareInvitation';
import wedding from '../../config/wedding';
export default function FinalInvitation({ onReplay }) {
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const result = await shareInvitation({ title: wedding.shareTitle, text: wedding.shareText, url: wedding.shareUrl });
    setCopied(result.success);
    setMessage(result.success ? (result.method === 'clipboard' ? 'Invitation link copied.' : 'Invitation shared.') : result.method === 'cancelled' ? '' : 'Could not share. Please copy the page link.');
  };
  return <section id="final" className="scene-section journal-finale" aria-labelledby="finale-title">
    <img className="finale-photo" src="/assets/story-seaside-1600.jpg" srcSet="/assets/story-seaside-800.jpg 800w, /assets/story-seaside-1600.jpg 1600w" sizes="100vw" width="1600" height="1067" alt="Sridhar and Gowri sharing a happy moment by the sea" loading="lazy" />
    <div className="finale-overlay" aria-hidden="true" />
    <div className="finale-content"><p className="journal-kicker" data-aos="fade-up">THE NEXT MEMORY HAS YOU IN IT.</p><h2 id="finale-title" data-aos="fade-up">We will save<br /><em>you a seat.</em></h2><p data-aos="fade-up">Come for the vows. Stay for the memories.<br />Your love and blessings are all we ask for.</p>
      <div className="finale-actions" data-aos="fade-up"><motion.button type="button" onClick={share} whileTap={{ scale: 0.96 }}><span>{copied ? <Check size={17} /> : <Share2 size={17} />}{copied ? 'Link shared' : 'Share the invitation'}</span><ArrowUpRight size={18} /></motion.button><motion.a href="/wedding-invitation.ics" target="_blank" rel="noreferrer" onClick={() => setMessage('Opening the wedding date in your calendar…')} whileTap={{ scale: 0.96 }}><span><CalendarPlus size={17} />Save our date</span><ArrowUpRight size={18} /></motion.a></div>
      <p className="finale-status" role="status" aria-live="polite">{message}</p><span className="finale-signature" data-aos="fade-up">With love, Sridhar &amp; Gowri</span>
    </div>
    <footer className="journal-footer"><span>S + G <small>MAILAM, 2026</small></span><p>Made of little moments. Meant for a lifetime.</p><button type="button" onClick={onReplay}><RotateCcw size={14} />Back to the beginning</button></footer>
  </section>;
}
