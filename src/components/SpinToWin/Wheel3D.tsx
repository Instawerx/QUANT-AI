'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Prize, PRIZES, DEGREES_PER_SEGMENT } from '@/types/spin';

interface Wheel3DProps {
  rotation: number;
  spinning: boolean;
}

function WheelSegment({ prize, index, rotation }: { prize: Prize; index: number; rotation: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index * DEGREES_PER_SEGMENT * Math.PI) / 180;
  const segmentAngle = (DEGREES_PER_SEGMENT * Math.PI) / 180;

  // Create segment shape
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const radius = 4;
    const innerRadius = 0.5;

    // Draw pie slice
    s.moveTo(innerRadius * Math.cos(-segmentAngle / 2), innerRadius * Math.sin(-segmentAngle / 2));
    s.lineTo(radius * Math.cos(-segmentAngle / 2), radius * Math.sin(-segmentAngle / 2));
    s.arc(0, 0, radius, -segmentAngle / 2, segmentAngle / 2, false);
    s.lineTo(innerRadius * Math.cos(segmentAngle / 2), innerRadius * Math.sin(segmentAngle / 2));
    s.arc(0, 0, innerRadius, segmentAngle / 2, -segmentAngle / 2, true);

    return s;
  }, [segmentAngle]);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3
    }),
    []
  );

  const geometry = useMemo(() => new THREE.ExtrudeGeometry(shape, extrudeSettings), [shape, extrudeSettings]);

  return (
    <group rotation={[0, 0, angle + rotation]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={prize.color}
          metalness={0.3}
          roughness={0.4}
          emissive={prize.color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Prize Text */}
      <Text
        position={[2.5 * Math.cos(0), 2.5 * Math.sin(0), 0.2]}
        rotation={[0, 0, 0]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {prize.label}
      </Text>

      {/* Amount Text */}
      {prize.amount > 0 && (
        <Text
          position={[2.5 * Math.cos(0), 2.5 * Math.sin(0) - 0.5, 0.2]}
          rotation={[0, 0, 0]}
          fontSize={0.25}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          💰
        </Text>
      )}
    </group>
  );
}

export default function Wheel3D({ rotation, spinning }: Wheel3DProps) {
  const wheelGroupRef = useRef<THREE.Group>(null);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);
  const velocity = useRef(0);

  // Update target rotation when prop changes
  useMemo(() => {
    if (spinning) {
      targetRotation.current = -((rotation + 360 * 5) * Math.PI) / 180; // 5 full rotations + target
    }
  }, [rotation, spinning]);

  useFrame((state, delta) => {
    if (!wheelGroupRef.current) return;

    if (spinning) {
      // Physics-based deceleration
      const difference = targetRotation.current - currentRotation.current;
      velocity.current += difference * delta * 2;
      velocity.current *= 0.95; // Friction

      currentRotation.current += velocity.current;
      wheelGroupRef.current.rotation.z = currentRotation.current;

      // Stop when close to target
      if (Math.abs(difference) < 0.01 && Math.abs(velocity.current) < 0.001) {
        currentRotation.current = targetRotation.current;
        wheelGroupRef.current.rotation.z = currentRotation.current;
      }
    }

    // Gentle floating animation when idle
    if (!spinning) {
      wheelGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={wheelGroupRef}>
      {/* Wheel segments */}
      {PRIZES.map((prize, index) => (
        <WheelSegment key={prize.id} prize={prize} index={index} rotation={0} />
      ))}

      {/* Center hub */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
        <meshStandardMaterial color="#1A1F3A" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Center logo/text */}
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.3}
        color="#00F0FF"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff"
      >
        QUANT
      </Text>
      <Text
        position={[0, -0.35, 0.5]}
        fontSize={0.2}
        color="#B030FF"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff"
      >
        AI
      </Text>

      {/* Outer ring */}
      <mesh position={[0, 0, -0.1]}>
        <torusGeometry args={[4.2, 0.15, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
