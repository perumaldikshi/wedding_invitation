import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';

const GOLD = '#d9a441';
const DEEP_GOLD = '#7e4c12';

function GoldMaterial({ roughness = 0.24, color = GOLD }) {
  return <meshStandardMaterial color={color} metalness={0.92} roughness={roughness} envMapIntensity={1.45} />;
}

function Flame({ position }) {
  const flame = useRef();
  const light = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 8 + position[0];
    if (flame.current) {
      flame.current.scale.y = 0.9 + Math.sin(t) * 0.1;
      flame.current.position.x = Math.sin(t * 0.6) * 0.012;
    }
    if (light.current) light.current.intensity = 0.95 + Math.sin(t * 1.3) * 0.16;
  });

  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.18, 0.11, 0.09, 24]} />
        <GoldMaterial roughness={0.16} />
      </mesh>
      <mesh ref={flame} position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.055, 12, 16]} />
        <meshBasicMaterial color="#ffb02e" toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 0.28, 0.1]} color="#ff9f35" distance={3.6} decay={2} />
    </group>
  );
}

function CarvedPillar({ x }) {
  return (
    <group position={[x, 0.75, -0.04]}>
      <mesh castShadow receiveShadow position={[0, -2.03, 0]}>
        <cylinderGeometry args={[0.5, 0.62, 0.5, 32]} />
        <meshStandardMaterial color="#c9a878" metalness={0.24} roughness={0.42} envMapIntensity={1.15} />
      </mesh>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.32, 3.85, 32, 6]} />
        <meshStandardMaterial color="#d9c29c" metalness={0.15} roughness={0.46} envMapIntensity={1.05} />
      </mesh>
      {[-1.58, -1.28, -0.65, 0, 0.65, 1.28, 1.58].map((y, index) => (
        <mesh key={y} castShadow position={[0, y, 0]}>
          <torusGeometry args={[index % 3 === 0 ? 0.34 : 0.29, index % 3 === 0 ? 0.065 : 0.035, 14, 36]} />
          <GoldMaterial roughness={0.2} color={index % 2 ? GOLD : DEEP_GOLD} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 2.02, 0]}>
        <cylinderGeometry args={[0.52, 0.28, 0.5, 24]} />
        <GoldMaterial roughness={0.22} />
      </mesh>
      <mesh castShadow position={[0, 2.31, 0]}>
        <boxGeometry args={[0.88, 0.18, 0.62]} />
        <GoldMaterial roughness={0.2} color="#c18a2d" />
      </mesh>
    </group>
  );
}

function Rosette({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.12, Math.sin(angle) * 0.12, 0]} rotation={[0, 0, angle]} castShadow>
            <sphereGeometry args={[0.07, 10, 8]} />
            <GoldMaterial roughness={0.2} />
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0.045]} castShadow>
        <sphereGeometry args={[0.085, 14, 12]} />
        <GoldMaterial roughness={0.14} color="#f0c36a" />
      </mesh>
    </group>
  );
}

function DoorLeaf({ side, open, texture }) {
  const isLeft = side === 'left';
  const hingeX = isLeft ? -1.96 : 1.96;
  const localCenter = isLeft ? 0.98 : -0.98;
  const { rotation } = useSpring({
    rotation: open ? (isLeft ? Math.PI * 0.47 : -Math.PI * 0.47) : 0,
    config: { mass: 4, tension: 46, friction: 20 },
    delay: isLeft ? 0 : 90,
  });

  const faceTexture = useMemo(() => {
    const next = texture.clone();
    next.colorSpace = THREE.SRGBColorSpace;
    next.wrapS = THREE.RepeatWrapping;
    if (!isLeft) {
      next.repeat.x = -1;
      next.offset.x = 1;
    }
    next.needsUpdate = true;
    return next;
  }, [texture, isLeft]);

  useEffect(() => () => faceTexture.dispose(), [faceTexture]);

  return (
    <animated.group position={[hingeX, 0.72, 0.06]} rotation-y={rotation}>
      <group position={[localCenter, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.96, 4.12, 0.19]} />
          <meshStandardMaterial color="#4f2f12" metalness={0.76} roughness={0.3} envMapIntensity={1.55} />
        </mesh>
        <mesh castShadow position={[0, 0, 0.102]}>
          <planeGeometry args={[1.86, 4.02]} />
          <meshStandardMaterial map={faceTexture} bumpMap={faceTexture} bumpScale={0.045} metalness={0.74} roughness={0.27} envMapIntensity={1.7} />
        </mesh>

        {[-0.78, 0.78].flatMap((x) => [-1.82, 1.82].map((y) => (
          <Rosette key={`${x}-${y}`} position={[x, y, 0.145]} scale={0.52} />
        )))}

        {[-1.48, -0.74, 0, 0.74, 1.48].map((y) => (
          <mesh key={y} castShadow position={[isLeft ? -0.91 : 0.91, y, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.24, 20]} />
            <GoldMaterial roughness={0.16} color="#e2b456" />
          </mesh>
        ))}

        <group position={[isLeft ? 0.72 : -0.72, -0.08, 0.2]}>
          <mesh castShadow>
            <sphereGeometry args={[0.12, 24, 18]} />
            <GoldMaterial roughness={0.13} color="#efc66f" />
          </mesh>
          <mesh castShadow position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.14, 0.026, 16, 32]} />
            <GoldMaterial roughness={0.15} />
          </mesh>
        </group>
      </group>
    </animated.group>
  );
}

function ArchCrown() {
  return (
    <group position={[0, 2.93, -0.03]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.85, 0.34, 0.46]} />
        <GoldMaterial roughness={0.26} color="#a96d1c" />
      </mesh>
      <mesh castShadow position={[0, 0.28, 0.02]}>
        <boxGeometry args={[4.45, 0.18, 0.4]} />
        <GoldMaterial roughness={0.2} />
      </mesh>
      {[-1.72, -1.15, -0.58, 0, 0.58, 1.15, 1.72].map((x, i) => (
        <group key={x} position={[x, i === 3 ? 0.69 : 0.54, 0.02]}>
          <mesh castShadow>
            <sphereGeometry args={[i === 3 ? 0.2 : 0.14, 18, 14]} />
            <GoldMaterial roughness={0.18} color={i % 2 ? GOLD : '#c48629'} />
          </mesh>
          <mesh castShadow position={[0, i === 3 ? 0.24 : 0.17, 0]}>
            <coneGeometry args={[i === 3 ? 0.11 : 0.075, i === 3 ? 0.3 : 0.2, 18]} />
            <GoldMaterial roughness={0.16} color="#e1b153" />
          </mesh>
        </group>
      ))}
      {[-1.9, -1.25, -0.63, 0, 0.63, 1.25, 1.9].map((x) => (
        <group key={x} position={[x, -0.32, 0.13]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.42, 10]} />
            <GoldMaterial roughness={0.25} />
          </mesh>
          <mesh castShadow position={[0, -0.25, 0]}>
            <coneGeometry args={[0.09, 0.16, 20]} />
            <GoldMaterial roughness={0.16} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function RoyalDoors({ open = false, onOpenComplete }) {
  const sourceTexture = useTexture('/assets/ornate-gold-door-panel.jpg');
  const completedRef = useRef(false);

  useEffect(() => {
    if (!open || completedRef.current) return undefined;
    const timer = window.setTimeout(() => {
      completedRef.current = true;
      onOpenComplete?.();
    }, 2100);
    return () => window.clearTimeout(timer);
  }, [open, onOpenComplete]);

  return (
    <group position={[0, -0.18, 0]}>
      <mesh position={[0, -1.38, 1.75]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 8]} />
        <meshPhysicalMaterial color="#6c4a32" roughness={0.2} metalness={0.16} clearcoat={0.42} clearcoatRoughness={0.25} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -1.28, 0.08]}>
        <boxGeometry args={[4.85, 0.24, 0.55]} />
        <GoldMaterial roughness={0.26} color="#a87127" />
      </mesh>

      <CarvedPillar x={-2.48} />
      <CarvedPillar x={2.48} />
      <ArchCrown />
      <DoorLeaf side="left" open={open} texture={sourceTexture} />
      <DoorLeaf side="right" open={open} texture={sourceTexture} />

      <Flame position={[-2.15, -1.1, 0.72]} />
      <Flame position={[2.15, -1.1, 0.72]} />
      <Flame position={[-1.32, -1.28, 1.65]} />
      <Flame position={[1.32, -1.28, 1.65]} />
    </group>
  );
}
