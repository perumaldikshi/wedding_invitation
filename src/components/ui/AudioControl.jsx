import { motion } from 'framer-motion';
import { Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react';

export default function AudioControl({ playing, muted, blocked, error, onToggle, onToggleMute }) {
  return (
    <div className="soundtrack-control" data-audio-control role="group" aria-label="Background music controls">
      <motion.button type="button" className="soundtrack-toggle" onClick={onToggle} whileTap={{ scale: 0.96 }} aria-label={playing ? 'Pause music' : 'Play music'}>
        <Music2 size={16} aria-hidden="true" />
        <span>{blocked ? 'Tap for music' : 'Our soundtrack'}</span>
        {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
      </motion.button>
      {playing && <button type="button" className="soundtrack-mute" onClick={onToggleMute} aria-label={muted ? 'Unmute music' : 'Mute music'}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button>}
      {error && <span className="soundtrack-error" role="status">{error}</span>}
    </div>
  );
}
