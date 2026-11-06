import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Feather({ angle, length = 1, quality }) {
  const segments = quality === 'high' ? 18 : 12;
  return (
    <group rotation={[0, 0, angle]} scale={[1, length, 1]}>
      <mesh position={[0, 1.02, -0.02]} castShadow>
        <sphereGeometry args={[0.26, segments, segments]} />
        <meshPhysicalMaterial
          color="#0a7c75"
          roughness={0.28}
          metalness={0.26}
          iridescence={1}
          iridescenceIOR={1.65}
          iridescenceThicknessRange={[120, 440]}
          clearcoat={0.45}
        />
      </mesh>
      <mesh position={[0, 1.16, 0.215]} scale={[1, 1.15, 0.18]}>
        <sphereGeometry args={[0.115, segments, segments]} />
        <meshStandardMaterial color="#c49a2f" metalness={0.72} roughness={0.24} />
      </mesh>
      <mesh position={[0, 1.17, 0.235]} scale={[1, 1.1, 0.18]}>
        <sphereGeometry args={[0.07, segments, segments]} />
        <meshPhysicalMaterial color="#173b86" metalness={0.42} roughness={0.2} clearcoat={0.65} />
      </mesh>
      <mesh position={[0, 0.48, -0.03]}>
        <cylinderGeometry args={[0.012, 0.018, 1.05, 8]} />
        <meshStandardMaterial color="#99782b" metalness={0.45} roughness={0.38} />
      </mesh>
    </group>
  );
}

function Crest() {
  return (
    <group position={[0, 2.04, 0]}>
      {[-0.13, -0.065, 0, 0.065, 0.13].map((x, index) => (
        <group key={x} rotation={[0, 0, (index - 2) * -0.13]}>
          <mesh position={[x, 0.14, 0]}>
            <cylinderGeometry args={[0.008, 0.011, 0.28, 6]} />
            <meshStandardMaterial color="#1b5d62" metalness={0.35} roughness={0.36} />
          </mesh>
          <mesh position={[x, 0.3, 0]} scale={[1.25, 0.72, 0.7]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#1a7380" metalness={0.5} roughness={0.24} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function PeacockAura({ count = 24, side = 1 }) {
  const points = useRef();
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const phase = i * 2.39996;
      values[i * 3] = side * (2.1 + (i % 7) * 0.18) + Math.cos(phase) * 0.35;
      values[i * 3 + 1] = -0.8 + (i % 9) * 0.38;
      values[i * 3 + 2] = 0.15 + Math.sin(phase) * 0.45;
    }
    return values;
  }, [count, side]);

  useFrame(({ clock }, delta) => {
    if (!points.current) return;
    points.current.rotation.z = Math.sin(clock.elapsedTime * 0.18 + side) * 0.08;
    points.current.rotation.y += delta * 0.035 * side;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#32a99d" size={0.045} transparent opacity={0.68} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function RoyalPeacock({ position = [0, 0, 0], facing = 1, quality = 'medium' }) {
  const root = useRef();
  const fan = useRef();
  const head = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  const drag = useRef({ active: false, x: 0, rotation: 0 });
  const [tailOpen, setTailOpen] = useState(true);
  const featherCount = quality === 'low' ? 7 : quality === 'high' ? 15 : 11;
  const feathers = useMemo(() => Array.from({ length: featherCount }, (_, index) => {
    const t = featherCount === 1 ? 0.5 : index / (featherCount - 1);
    return {
      angle: THREE.MathUtils.degToRad(-68 + t * 136),
      length: 0.84 + Math.sin(t * Math.PI) * 0.3,
    };
  }), [featherCount]);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    if (root.current && !drag.current.active) {
      root.current.position.y = position[1] + Math.sin(time * 2.2 + facing) * 0.025;
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, facing < 0 ? Math.PI : 0, 4, delta);
    }
    if (fan.current) {
      const target = tailOpen ? 1 : 0.25;
      fan.current.scale.x = THREE.MathUtils.damp(fan.current.scale.x, target, 4.2, delta);
      fan.current.scale.y = THREE.MathUtils.damp(fan.current.scale.y, tailOpen ? 1 : 0.76, 4.2, delta);
      fan.current.rotation.y = Math.sin(time * 0.8) * 0.035;
    }
    if (head.current) {
      head.current.rotation.z = Math.sin(time * 1.15 + facing) * 0.11;
      head.current.rotation.x = Math.sin(time * 1.8) * 0.045;
    }
    if (leftLeg.current && rightLeg.current) {
      leftLeg.current.rotation.x = Math.sin(time * 2.2) * 0.2;
      rightLeg.current.rotation.x = Math.sin(time * 2.2 + Math.PI) * 0.2;
    }
  });

  const onPointerDown = (event) => {
    event.stopPropagation();
    drag.current = { active: true, x: event.clientX, rotation: root.current?.rotation.y || 0 };
    event.target.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!drag.current.active || !root.current) return;
    event.stopPropagation();
    root.current.rotation.y = drag.current.rotation + (event.clientX - drag.current.x) * 0.012;
  };
  const onPointerUp = (event) => {
    if (!drag.current.active) return;
    event.stopPropagation();
    drag.current.active = false;
    setTailOpen((value) => !value);
    event.target.releasePointerCapture?.(event.pointerId);
  };

  return (
    <group
      ref={root}
      position={position}
      rotation={[0, facing < 0 ? Math.PI : 0, 0]}
      scale={quality === 'low' ? 0.7 : 0.78}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <group ref={fan} position={[0, 0.62, -0.33]}>
        {feathers.map((feather, index) => <Feather key={index} {...feather} quality={quality} />)}
      </group>

      <mesh position={[0, 0.65, 0]} scale={[0.62, 0.82, 0.72]} castShadow>
        <sphereGeometry args={[0.42, quality === 'high' ? 28 : 20, quality === 'high' ? 24 : 16]} />
        <meshPhysicalMaterial color="#104d56" roughness={0.24} metalness={0.24} iridescence={1} iridescenceIOR={1.7} clearcoat={0.52} />
      </mesh>
      <mesh position={[0, 1.25, 0.03]} scale={[0.56, 1.65, 0.58]} rotation={[0, 0, -0.05 * facing]} castShadow>
        <sphereGeometry args={[0.31, 20, 18]} />
        <meshPhysicalMaterial color="#087d7b" roughness={0.22} metalness={0.2} iridescence={1} iridescenceThicknessRange={[180, 520]} clearcoat={0.5} />
      </mesh>
      <group ref={head} position={[0.04 * facing, 1.78, 0.02]}>
        <mesh scale={[0.95, 0.82, 0.9]} castShadow>
          <sphereGeometry args={[0.25, 20, 18]} />
          <meshPhysicalMaterial color="#126d77" roughness={0.2} metalness={0.28} iridescence={1} clearcoat={0.5} />
        </mesh>
        <mesh position={[0.02 * facing, 0.01, 0.225]} scale={[1, 0.82, 0.35]}>
          <sphereGeometry args={[0.115, 14, 12]} />
          <meshStandardMaterial color="#f2eee0" roughness={0.7} />
        </mesh>
        <mesh position={[0.055 * facing, 0.035, 0.32]}>
          <sphereGeometry args={[0.035, 12, 10]} />
          <meshStandardMaterial color="#090806" roughness={0.25} />
        </mesh>
        <mesh position={[0.13 * facing, -0.01, 0.2]} rotation={[0, 0, -Math.PI / 2 * facing]}>
          <coneGeometry args={[0.065, 0.34, 10]} />
          <meshStandardMaterial color="#bf9d55" metalness={0.35} roughness={0.4} />
        </mesh>
        <Crest />
      </group>

      {[-0.13, 0.13].map((x, index) => (
        <group key={x} ref={index === 0 ? leftLeg : rightLeg} position={[x, 0.08, 0.02]}>
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.018, 0.025, 0.38, 8]} />
            <meshStandardMaterial color="#ad8b43" metalness={0.28} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.07, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.04, 0.26, 7]} />
            <meshStandardMaterial color="#ad8b43" roughness={0.52} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
