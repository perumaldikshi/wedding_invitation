export default function WebGLFallback({ children, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        backgroundImage: "linear-gradient(rgba(8,2,1,.26), rgba(8,2,1,.58)), url('/assets/palace-mandapam-portrait.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
}
