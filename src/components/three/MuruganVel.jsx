import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MuruganVel({ revealed = false, position = [0, 0.8, -0.5] }) {
  const group = useRef();
  const glow = useRef();
  const headShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 1.25);
    shape.bezierCurveTo(-0.12, 0.88, -0.38, 0.55, -0.34, 0.1);
    shape.bezierCurveTo(-0.22, 0.28, -0.1, 0.35, 0, -0.05);
    shape.bezierCurveTo(0.1, 0.35, 0.22, 0.28, 0.34, 0.1);
    shape.bezierCurveTo(0.38, 0.55, 0.12, 0.88, 0, 1.25);
    return shape;
  }, []);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const target = revealed ? 1 : 0.001;
    group.current.scale.x = THREE.MathUtils.damp(group.current.scale.x, target, 4.2, delta);
    group.current.scale.y = THREE.MathUtils.damp(group.current.scale.y, target, 4.2, delta);
    group.current.scale.z = THREE.MathUtils.damp(group.current.scale.z, target, 4.2, delta);
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.15;
    group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.1) * 0.06;
    if (glow.current) glow.current.intensity = revealed ? 2.4 + Math.sin(clock.elapsedTime * 2) * 0.35 : 0;
  });

  return (
    <group ref={group} position={position} scale={0.001}>
      <pointLight ref={glow} color="#ffcf6b" intensity={0} distance={6} decay={2} />
      <mesh position={[0, -0.78, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 2.75, 18]} />
        <meshStandardMaterial color="#d89e35" metalness={0.96} roughness={0.14} envMapIntensity={1.8} />
      </mesh>
      <mesh position={[0, 0.56, 0.015]} castShadow>
        <extrudeGeometry args={[headShape, { depth: 0.07, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 3 }]} />
        <meshStandardMaterial color="#f1c760" metalness={0.98} roughness={0.12} envMapIntensity={2} />
      </mesh>
      <mesh position={[0, 0.38, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.025, 12, 42, Math.PI]} />
        <meshStandardMaterial color="#c78628" metalness={0.94} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.2, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.018, 10, 36]} />
        <meshBasicMaterial color="#ffd875" transparent opacity={0.72} toneMapped={false} />
      </mesh>
      <mesh position={[0, -2.15, 0]}>
        <sphereGeometry args={[0.115, 20, 16]} />
        <meshStandardMaterial color="#e5b34f" metalness={0.96} roughness={0.12} />
      </mesh>
    </group>
  );
}
