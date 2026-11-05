import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GoldenParticles({ count = 200, spread = 8, speed = 0.3 }) {
  const meshRef = useRef();
  const timeRef = useRef(0);

  const [positions, phases] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return [positions, phases];
  }, [count, spread]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    return geo;
  }, [positions]);

  const material = useMemo(() =>
    new THREE.PointsMaterial({
      color: new THREE.Color('#FFD700'),
      size: 0.04,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }), []);

  useFrame((state, delta) => {
    timeRef.current += delta * speed;
    const posArr = geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const phase = phases[i];
      posArr[i * 3 + 1] = positions[i * 3 + 1] + Math.sin(timeRef.current + phase) * 0.3;
      posArr[i * 3] = positions[i * 3] + Math.cos(timeRef.current * 0.5 + phase) * 0.1;
    }
    geometry.attributes.position.needsUpdate = true;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return <points ref={meshRef} geometry={geometry} material={material} />;
}
