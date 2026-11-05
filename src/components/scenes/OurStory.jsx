import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipe } from '../../hooks/useTouch';
import OrnamentalDivider from '../ui/OrnamentalDivider';
import wedding from '../../config/wedding';

function StoryCard({ chapter, isActive, direction }) {
  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <motion.div
      key={chapter.chapter}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-6"
    >
      {/* Photo or placeholder */}
      <div className="flex-shrink-0">
        {chapter.image ? (
          <div
            className="w-56 h-72 md:w-64 md:h-80 rounded overflow-hidden border"
            style={{ borderColor: '#D4A017', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
          >
            <img src={chapter.image} alt={chapter.chapter} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div
            className="w-56 h-72 md:w-64 md:h-80 rounded flex flex-col items-center justify-center border relative"
            style={{
              borderColor: 'rgba(212,160,23,0.4)',
              background: 'radial-gradient(circle, #2a1005, #0a0505)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <span className="text-5xl mb-4" aria-hidden="true">🌸</span>
            <p className="text-xs tracking-widest" style={{ color: 'rgba(212,160,23,0.5)' }}>
              Add your photo
            </p>
            {/* Ornamental corners */}
            {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
              <div key={pos} className={`absolute ${pos} text-sm`} style={{ color: '#D4A017', opacity: 0.5 }} aria-hidden="true">✦</div>
            ))}
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="max-w-sm text-center md:text-left">
        <p className="text-xs tracking-[0.4em] mb-2" style={{ color: 'rgba(212,160,23,0.6)' }}>
          {chapter.year}
        </p>
        <h3
          className="font-display text-3xl md:text-4xl mb-2"
          style={{ color: '#FFD700' }}
        >
          {chapter.chapter}
        </h3>
        <p
          className="text-sm mb-2"
          style={{ color: 'rgba(247,231,206,0.5)', fontFamily: 'Noto Serif Tamil, serif' }}
          lang="ta"
        >
          {chapter.chapterTamil}
        </p>
        <p className="text-base md:text-lg leading-relaxed mt-4" style={{ color: 'rgba(247,231,206,0.8)' }}>
          {chapter.text}
        </p>
      </div>
    </motion.div>
  );
}

export default function OurStory() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const chapters = wedding.story;

  const goTo = (index) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const { onTouchStart, onTouchEnd } = useSwipe({
    onSwipeLeft: () => goTo(Math.min(current + 1, chapters.length - 1)),
    onSwipeRight: () => goTo(Math.max(current - 1, 0)),
  });

  return (
    <section
      id="story"
      className="scene-section flex flex-col items-center justify-center min-h-screen relative"
      style={{ background: 'linear-gradient(180deg, #0a0505, #140808, #0a0505)' }}
      aria-label="Our story"
    >
      {/* Decorative top */}
      <div className="relative z-10 text-center pt-16 pb-8 px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="tracking-[0.4em] text-xs mb-4"
          style={{ color: 'rgba(212,160,23,0.6)' }}
        >
          OUR JOURNEY
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl"
          style={{ color: '#FFD700' }}
        >
          Our Story
        </motion.h2>
        <OrnamentalDivider />
      </div>

      {/* Carousel container */}
      <div
        className="relative w-full flex-1 flex items-center justify-center"
        style={{ minHeight: 480, maxWidth: 900 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-live="polite"
        aria-label={`Story slide ${current + 1} of ${chapters.length}: ${chapters[current].chapter}`}
      >
        <AnimatePresence custom={direction} mode="wait">
          <StoryCard key={current} chapter={chapters[current]} isActive direction={direction} />
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex items-center gap-6 pb-16 pt-6">
        <button
          onClick={() => goTo(Math.max(current - 1, 0))}
          disabled={current === 0}
          className="touch-target w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer"
          style={{
            borderColor: current === 0 ? 'rgba(212,160,23,0.2)' : '#D4A017',
            color: current === 0 ? 'rgba(212,160,23,0.3)' : '#D4A017',
            background: 'rgba(10,5,5,0.5)',
          }}
          aria-label="Previous story"
        >
          ←
        </button>

        {/* Dots */}
        <div className="flex gap-3" role="tablist" aria-label="Story navigation">
          {chapters.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-2.5 h-2.5 rounded-full transition-all cursor-pointer"
              style={{
                background: i === current ? '#FFD700' : 'rgba(212,160,23,0.3)',
                transform: i === current ? 'scale(1.4)' : 'scale(1)',
                boxShadow: i === current ? '0 0 8px #FFD700' : 'none',
              }}
              role="tab"
              aria-selected={i === current}
              aria-label={`Story ${i + 1}: ${chapters[i].chapter}`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(Math.min(current + 1, chapters.length - 1))}
          disabled={current === chapters.length - 1}
          className="touch-target w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer"
          style={{
            borderColor: current === chapters.length - 1 ? 'rgba(212,160,23,0.2)' : '#D4A017',
            color: current === chapters.length - 1 ? 'rgba(212,160,23,0.3)' : '#D4A017',
            background: 'rgba(10,5,5,0.5)',
          }}
          aria-label="Next story"
        >
          →
        </button>
      </div>
    </section>
  );
}

