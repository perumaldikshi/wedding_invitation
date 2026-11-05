import { motion } from 'framer-motion';
import OrnamentalDivider from '../ui/OrnamentalDivider';
import wedding from '../../config/wedding';

const EVENT_ICONS = {
  rings: '💍',
  music: '🎵',
  star: '⭐',
  sparkle: '✨',
};

const EVENT_COLORS = {
  engagement: { bg: '#1a0505', border: '#D4A017', accent: '#FFD700' },
  mehendi: { bg: '#0a1a05', border: '#3a7d44', accent: '#5cb85c' },
  wedding: { bg: '#1a0510', border: '#D4A017', accent: '#FFD700' },
  reception: { bg: '#05101a', border: '#4a90d9', accent: '#6aaae8' },
};

function EventCard({ event, index }) {
  const colors = EVENT_COLORS[event.id] || EVENT_COLORS.engagement;

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-xl overflow-hidden flex flex-col justify-between"
      style={{
        background: `linear-gradient(145deg, ${colors.bg}, #0a0505)`,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
      }}
      aria-label={event.title}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }} />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${colors.accent}20`, border: `1px solid ${colors.accent}40` }}
            aria-hidden="true"
          >
            {EVENT_ICONS[event.icon] || '✦'}
          </div>
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold" style={{ color: colors.accent }}>
              {event.title}
            </h3>
            {event.titleTamil && (
              <p className="text-xs mt-0.5" style={{ color: `${colors.accent}90`, fontFamily: 'Noto Serif Tamil, serif' }} lang="ta">
                {event.titleTamil}
              </p>
            )}
          </div>
        </div>

        {/* Details grid */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-[11px] tracking-widest mb-0.5 uppercase" style={{ color: `${colors.accent}80` }}>DATE</dt>
            <dd className="text-sm font-medium" style={{ color: '#F7E7CE' }}>{event.date}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-widest mb-0.5 uppercase" style={{ color: `${colors.accent}80` }}>TIME</dt>
            <dd className="text-sm font-medium" style={{ color: '#F7E7CE' }}>{event.time}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[11px] tracking-widest mb-0.5 uppercase" style={{ color: `${colors.accent}80` }}>VENUE</dt>
            <dd className="text-sm font-semibold" style={{ color: '#F7E7CE' }}>{event.venue}</dd>
            <dd className="text-xs mt-0.5" style={{ color: 'rgba(247,231,206,0.6)' }}>{event.address}</dd>
          </div>
          {event.dressCode && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] tracking-widest mb-1 uppercase" style={{ color: `${colors.accent}80` }}>DRESS CODE</dt>
              <dd
                className="text-xs"
                style={{
                  color: colors.accent,
                  background: `${colors.accent}15`,
                  border: `1px solid ${colors.accent}30`,
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 4,
                }}
              >
                {event.dressCode}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Location Button */}
      {event.mapUrl && (
        <div className="px-6 pb-6 pt-0">
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs md:text-sm font-semibold tracking-wider transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}25, ${colors.accent}10)`,
              border: `1px solid ${colors.accent}60`,
              color: colors.accent,
              boxShadow: `0 4px 15px rgba(0,0,0,0.3)`
            }}
          >
            <span>📍</span>
            <span>View {event.id === 'wedding' ? 'Muhurtham' : 'Reception'} Location</span>
            <span className="text-xs opacity-75">↗</span>
          </a>
        </div>
      )}

      {/* Corner ornament */}
      <div
        className="absolute top-4 right-4 text-sm"
        style={{ color: `${colors.accent}30` }}
        aria-hidden="true"
      >
        ✦
      </div>
    </motion.article>
  );
}

export default function WeddingEvents() {
  const enabledEvents = wedding.events.filter((e) => e.enabled);

  return (
    <section
      id="events"
      className="scene-section py-20 px-4 min-h-screen flex flex-col justify-center"
      style={{ background: 'linear-gradient(180deg, #0a0505, #140808, #0a0505)' }}
      aria-label="Wedding events"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="tracking-[0.4em] text-xs mb-3 uppercase"
            style={{ color: 'rgba(212,160,23,0.6)' }}
          >
            THE AUSPICIOUS OCCASION
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl"
            style={{ color: '#FFD700' }}
          >
            Wedding Events &amp; Locations
          </motion.h2>
          <OrnamentalDivider />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-base text-champagne/80 font-body"
          >
            Join us with family and friends at Mailam, Tamil Nadu
          </motion.p>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enabledEvents.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
