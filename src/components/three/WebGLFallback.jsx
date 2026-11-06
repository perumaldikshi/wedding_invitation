export default function WebGLFallback({ children, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ backgroundColor: '#190b06', minHeight: '100vh' }}
    >
      <picture className="fallback-mandapam" aria-hidden="true">
        <source media="(min-aspect-ratio: 1/1)" srcSet="/assets/mandapam-landscape-4k.jpg" />
        <img src="/assets/mandapam-portrait-4k.jpg" width="2560" height="3840" alt="" decoding="async" />
      </picture>
      <div className="fallback-mandapam-shade" aria-hidden="true" />
      {children}
    </div>
  );
}
