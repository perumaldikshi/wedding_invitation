import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Flower2 } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import wedding from '../../config/wedding';

export default function CoupleReveal() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const photo = wedding.couplePhotos.main;
  const notePhoto = wedding.couplePhotos.together;
  return <section id="couple" ref={ref} className="scene-section journal-couple" aria-labelledby="journal-couple-title">
    <div className="journal-section-index" data-aos="fade-up"><span>01 / THE TWO OF US</span><span>A LOVE LETTER FROM MAILAM</span></div>
    <div className="journal-couple-grid">
      <div className="journal-couple-visual" data-aos="fade-up">
        <motion.figure className="journal-main-portrait" style={{ y: reduced ? 0 : photoY }}><img src={photo.image} srcSet={photo.imageSrcSet} sizes="(min-width: 900px) 440px, 80vw" width={photo.imageWidth} height={photo.imageHeight} alt={photo.imageAlt} loading="lazy" /><figcaption>Our favourite place is together.</figcaption></motion.figure>
        <motion.figure className="journal-photo-note" whileHover={reduced ? {} : { rotate: 0, y: -5 }}><img src={notePhoto.image} srcSet={notePhoto.imageSrcSet} sizes="(min-width: 900px) 230px, 45vw" width={notePhoto.imageWidth} height={notePhoto.imageHeight} alt={notePhoto.imageAlt} loading="lazy" decoding="async" /><figcaption>you, me &amp; the road ahead</figcaption></motion.figure>
        <span className="journal-photo-number" aria-hidden="true">S + G</span>
      </div>
      <div className="journal-couple-copy">
        <p className="journal-kicker" data-aos="fade-up"><Flower2 size={17} /> SOME THINGS ARE MEANT TO BE</p>
        <h2 id="journal-couple-title" data-aos="fade-up">Two people.<br /><em>One shared world.</em></h2>
        <p className="journal-intro" data-aos="fade-up">A little fate, a lot of love, and two families becoming one. We are so happy to share our next chapter with you.</p>
        <div className="journal-people">
          <div data-aos="fade-up" data-aos-delay="50"><span>THE GROOM</span><h3>{wedding.groomName}</h3><p lang="ta">{wedding.groomNameTamil}</p><small>{wedding.groomDegree}</small><p>{wedding.groomOccupation}</p><div className="journal-family"><span>WITH THE BLESSINGS OF</span><strong>{wedding.groomParents}</strong><p>{wedding.groomNative}</p></div></div>
          <div data-aos="fade-up" data-aos-delay="150"><span>THE BRIDE</span><h3>{wedding.brideName}</h3><p lang="ta">{wedding.brideNameTamil}</p><small>{wedding.brideDegree}</small><div className="journal-family"><span>WITH THE BLESSINGS OF</span><strong>{wedding.brideParents}</strong><p>{wedding.brideNative}</p></div></div>
        </div>
        <a className="journal-text-link" href="#invitation">We wrote you a little letter <ArrowDown size={16} /></a>
      </div>
    </div>
  </section>;
}
