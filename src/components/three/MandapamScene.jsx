import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Pillar({ position }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.4]} />
        <meshStandardMaterial color="#D4A017" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 3.0, 12]} />
        <meshStandardMaterial color="#F7E7CE" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.35]} />
        <meshStandardMaterial color="#D4A017" metalness={0.85} roughness={0.1} />
      </mesh>
      {/* Gold rings on shaft */}
      {[0.5, 1.5, 2.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.14, 0.025, 8, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function FlowerGarland({ y = 3.2, fromX, toX, z = 0 }) {
  const points = useMemo(() => {
    const pts = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = fromX + (toX - fromX) * t;
      const sag = Math.sin(t * Math.PI) * -0.4;
      pts.push(new THREE.Vector3(x, y + sag, z));
    }
    return pts;
  }, [y, fromX, toX, z]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.025, 6, false), [curve]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#FFB7C5" roughness={0.8} metalness={0} />
    </mesh>
  );
}

function FloatingLamp({ position }) {
  const ref = useRef();
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + phase) * 0.08;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshStandardMaterial color="#D4A017" metalness={0.9} roughness={0.1} />
      </mesh>
      <pointLight intensity={0.4} distance={2} color="#FFD700" />
    </group>
  );
}

export default function MandapamScene() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.03;
    }
  });

  const pillars = [
    [-3, 0, -2], [3, 0, -2],
    [-3, 0, 2], [3, 0, 2],
    [-3, 0, -5], [3, 0, -5],
  ];

  return (
    <group ref={groupRef}>
      {/* Floor platform */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[8, 0.3, 10]} />
        <meshStandardMaterial color="#2a1010" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Floor center carpet */}
      <mesh position={[0, -0.0, 0]} receiveShadow>
        <boxGeometry args={[5, 0.01, 7]} />
        <meshStandardMaterial color="#800020" roughness={0.9} metalness={0} />
      </mesh>
      {/* Gold border on carpet */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[5.1, 0.005, 7.1]} />
        <meshStandardMaterial color="#D4A017" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pillars */}
      {pillars.map((pos, i) => <Pillar key={i} position={pos} />)}

      {/* Roof beams */}
      {[-3, 0, 3].map((x, i) => (
        <mesh key={i} position={[x, 3.25, -1.5]}>
          <boxGeometry args={[0.15, 0.15, 10]} />
          <meshStandardMaterial color="#D4A017" metalness={0.75} roughness={0.25} />
        </mesh>
      ))}

      {/* Garlands */}
      <FlowerGarland fromX={-3} toX={3} y={3.0} z={-2} />
      <FlowerGarland fromX={-3} toX={3} y={3.0} z={2} />
      <FlowerGarland fromX={-3} toX={3} y={3.0} z={-5} />

      {/* Floating lamps */}
      {[[-2, 2.8, -2], [2, 2.8, -2], [-2, 2.8, 2], [2, 2.8, 2]].map((pos, i) => (
        <FloatingLamp key={i} position={pos} />
      ))}

      {/* Sacred fire / agni */}
      <group position={[0, 0.3, -1.5]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.4, 0.3, 12]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        <pointLight position={[0, 0.5, 0]} intensity={2} distance={5} color="#FF6600" />
        <mesh position={[0, 0.25, 0]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial color="#FF6600" emissive="#FF4400" emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Background environment hint */}
      <mesh position={[0, 2, -6]}>
        <planeGeometry args={[12, 7]} />
        <meshStandardMaterial color="#2a0a05" roughness={1} />
      </mesh>
    </group>
  );
}
