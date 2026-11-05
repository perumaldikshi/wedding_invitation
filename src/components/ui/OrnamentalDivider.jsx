export default function OrnamentalDivider({ symbol = '✦', className = '' }) {
  return (
    <div className={`ornamental-divider ${className}`} aria-hidden="true">
      <span style={{ color: 'rgba(212,160,23,0.4)' }}>{'—'.repeat(3)}</span>
      <span
        className="text-sm"
        style={{ color: '#D4A017', textShadow: '0 0 10px rgba(212,160,23,0.5)' }}
      >
        {symbol}
      </span>
      <span style={{ color: 'rgba(212,160,23,0.4)' }}>{'—'.repeat(3)}</span>
    </div>
  );
}
