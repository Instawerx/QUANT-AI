'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WheelPointer() {
  const pointerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!pointerRef.current) return;

    // Subtle bounce animation
    const bounce = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    pointerRef.current.position.y = 4.5 + bounce;
  });

  return (
    <group ref={pointerRef} position={[0, 4.5, 0.5]}>
      {/* Arrow pointer */}
      <mesh rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.3, 0.8, 3]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>

      {/* Glow effect */}
      <pointLight position={[0, -0.5, 0]} color="#FFD700" intensity={2} distance={2} />
    </group>
  );
}
