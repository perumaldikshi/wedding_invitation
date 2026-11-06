import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin, Moon, Sunrise } from 'lucide-react';
import wedding from '../../config/wedding';
export default function WeddingEvents() {
  return <section id="events" className="scene-section day-itinerary" aria-labelledby="itinerary-title">
    <div className="journal-section-index" data-aos="fade-up"><span>04 / THE CELEBRATIONS</span><span>MAILAM, TAMIL NADU</span></div>
    <header className="itinerary-heading"><h2 id="itinerary-title" data-aos="fade-up">One beautiful day.<br /><em>Two reasons to celebrate.</em></h2><p data-aos="fade-up">{wedding.muhurthamDate}<span>From the first light to the last dance.</span></p></header>
    <div className="itinerary-list">{wedding.events.filter(event => event.enabled).map((event, index) => <article className={`itinerary-event itinerary-event-${event.id}`} key={event.id} aria-labelledby={`event-${event.id}`}>
      <div className="itinerary-time" data-aos="fade-up"><span>0{index + 1} / {event.id === 'wedding' ? 'WITH THE MORNING LIGHT' : 'AN EVENING TO REMEMBER'}</span>{event.id === 'wedding' ? <Sunrise size={36} strokeWidth={1} /> : <Moon size={34} strokeWidth={1} />}<strong>{event.id === 'wedding' ? '06:00' : '18:30'}</strong><small>{event.time}</small></div>
      <div className="itinerary-details" data-aos="fade-up" data-aos-delay="100"><p lang="ta">{event.titleTamil}</p><h3 id={`event-${event.id}`}>{event.title}</h3><h4>{event.venue}</h4><p>{event.address}</p><div className="itinerary-dress"><span>COME DRESSED IN</span>{event.dressCode}</div></div>
      <motion.a className="itinerary-map" href={event.mapUrl} target="_blank" rel="noopener noreferrer" whileHover={{ y: -5 }} whileTap={{ scale: 0.97 }} aria-label={`Get directions to ${event.venue}`}><MapPin size={32} strokeWidth={1} /><span>Meet us<br /><em>right here.</em></span><ArrowUpRight size={24} /></motion.a>
    </article>)}</div>
    <p className="itinerary-note" data-aos="fade-up">Bring your blessings. We will take care of the memories.</p>
  </section>;
}
