import { motion } from 'framer-motion';
import wedding from '../../config/wedding';
import { useReducedMotion } from '../../hooks/useReducedMotion';
const notes = ['A moment wrapped in blessings.', 'Just us, the sea, and a thousand little smiles.', 'The everyday moments we want to keep forever.'];
export default function OurStory() {
  const reduced = useReducedMotion();
  return <section id="story" className="scene-section memory-journal" aria-labelledby="memory-title">
    <div className="journal-section-index" data-aos="fade-up"><span>03 / OUR LITTLE MOMENTS</span><span>COLLECTED WITH LOVE</span></div>
    <div className="memory-layout">
      <header className="memory-heading"><p className="journal-kicker" data-aos="fade-up">NOT JUST A DAY. A WHOLE STORY.</p><h2 id="memory-title" data-aos="fade-up">This is what<br /><em>together</em><br />looks like.</h2><p data-aos="fade-up">The big smiles. The quiet moments. The places that became ours. A few pages from our favourite story.</p><span className="memory-handwriting" data-aos="fade-up">more of these, forever.</span></header>
      <div className="memory-gallery">
        {wedding.story.map((chapter, index) => <div className={`memory-entry memory-entry-${index}`} key={chapter.image} data-aos="fade-up" data-aos-delay={index * 70}>
          <motion.figure className="memory-print" whileHover={reduced ? {} : { y: -7, rotate: index === 0 ? -1 : 1 }} transition={{ duration: 0.3 }}><img src={chapter.image} srcSet={chapter.imageSrcSet} sizes="(min-width: 900px) 420px, calc(100vw - 64px)" width={chapter.imageWidth} height={chapter.imageHeight} alt={chapter.imageAlt} loading="lazy" decoding="async" /><figcaption><span>0{index + 1}</span><strong>{chapter.chapter}</strong></figcaption></motion.figure>
          <p>{notes[index]}</p>
        </div>)}
      </div>
    </div>
  </section>;
}
