import { motion } from 'framer-motion';

export default function GoldButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  ariaLabel,
  icon,
}) {
  const base = {
    fontFamily: 'Cormorant Garamond, Georgia, serif',
    letterSpacing: '0.15em',
    fontSize: '0.9rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #D4A017 100%)',
      color: '#0a0505',
      border: 'none',
      padding: '0.8rem 2.5rem',
      borderRadius: '2px',
      boxShadow: '0 4px 20px rgba(212,160,23,0.4)',
    },
    outline: {
      background: 'transparent',
      color: '#D4A017',
      border: '1px solid #D4A017',
      padding: '0.75rem 2rem',
      borderRadius: '2px',
      boxShadow: 'inset 0 0 0 0 #D4A017',
    },
    ghost: {
      background: 'rgba(212,160,23,0.1)',
      color: '#D4A017',
      border: '1px solid rgba(212,160,23,0.3)',
      padding: '0.7rem 1.8rem',
      borderRadius: '2px',
    },
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 tracking-widest font-medium transition-all touch-target ${className}`}
      style={{ ...base, ...variants[variant] }}
      whileHover={disabled ? {} : { scale: 1.03, boxShadow: '0 6px 25px rgba(212,160,23,0.5)' }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      aria-label={ariaLabel}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </motion.button>
  );
}
