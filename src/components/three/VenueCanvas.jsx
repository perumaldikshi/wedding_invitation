import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import MandapamScene from './MandapamScene';
import GoldenParticles from './GoldenParticles';

export default function VenueCanvas() {
  return (
    <div className="w-full h-full" style={{ minHeight: 400 }}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 2, 7]} fov={55} />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          enableDamping
          dampingFactor={0.08}
          target={[0, 1, 0]}
          rotateSpeed={0.5}
          touches={{ ONE: 1 /* ROTATE */, TWO: 2 /* DOLLY_PAN */ }}
        />
        <ambientLight intensity={0.4} color="#fff5e0" />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#FFD700" castShadow />
        <pointLight position={[-3, 4, -2]} intensity={0.6} color="#FF8C00" />
        <MandapamScene />
        <GoldenParticles count={80} spread={6} />
        <fog attach="fog" args={['#0a0505', 10, 25]} />
      </Canvas>
    </div>
  );
}
