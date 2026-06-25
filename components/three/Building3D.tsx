"use client";

import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { BuildingFloor } from "./BuildingFloor";

const FLOORS = [
  { label: "Commercial Cleaning", slug: "commercial-cleaning", height: 0.5 },
  { label: "Office Cleaning", slug: "office-cleaning", height: 0.45 },
  { label: "Strata Cleaning", slug: "strata-cleaning", height: 0.5 },
  { label: "End of Lease Cleaning", slug: "end-of-lease-cleaning", height: 0.4 },
  { label: "Property Maintenance", slug: "property-maintenance", height: 0.45 },
  { label: "Handyman Services", slug: "handyman-services", height: 0.4 },
  { label: "Pressure Washing", slug: "pressure-washing", height: 0.4 },
  { label: "Garden Maintenance", slug: "garden-maintenance", height: 0.4 },
  { label: "Emergency Support", slug: "emergency-property-support", height: 0.35 },
];

interface Building3DProps {
  scrollRef: RefObject<number>;
  activeFloor: number;
  mouseRef: RefObject<{ x: number; y: number }>;
  onSelect: (index: number) => void;
}

export function Building3D({ scrollRef, activeFloor, mouseRef, onSelect }: Building3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const lookY = useRef(0);

  // Stack floors from the bottom up, recording each floor's centre Y. Stable.
  let yCursor = -2;
  const floorPositions: { y: number; height: number }[] = [];
  for (const floor of FLOORS) {
    floorPositions.push({ y: yCursor + floor.height / 2, height: floor.height });
    yCursor += floor.height + 0.06;
  }
  const topY = yCursor;
  const centerY = (floorPositions[0].y + topY) / 2;

  // Symmetric separation around the centre so the tower stays framed.
  const offsetFor = (i: number) =>
    (floorPositions[i].y - centerY) * THREE.MathUtils.clamp(scrollRef.current ?? 0, 0, 1) * 0.6;

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.001, delta);
    const camK = 1 - Math.pow(0.0002, delta);
    const s = scrollRef.current ?? 0;
    const m = mouseRef.current ?? { x: 0, y: 0 };

    if (groupRef.current) {
      const targetRotationY = -0.5 + m.x * 0.55 + s * 0.35;
      const targetRotationX = 0.06 + m.y * 0.16;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, k);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, k);
    }

    if (roofRef.current) {
      const targetRoofY = topY + offsetFor(FLOORS.length - 1) + 0.35;
      roofRef.current.position.y = THREE.MathUtils.lerp(roofRef.current.position.y, targetRoofY, k);
    }

    // Camera ascends the tower, keeping the active floor centred so every floor
    // stays framed as you scroll through all nine.
    const ascend = THREE.MathUtils.clamp((s - 0.05) / 0.95, 0, 1);
    const fi = ascend * (FLOORS.length - 1);
    const lo = Math.floor(fi);
    const hi = Math.min(FLOORS.length - 1, lo + 1);
    const frac = fi - lo;
    const floorY = THREE.MathUtils.lerp(
      floorPositions[lo].y + offsetFor(lo),
      floorPositions[hi].y + offsetFor(hi),
      frac
    );
    // Blend from "whole building framed" at the hero to "follow the floor" once scrolling.
    const blend = THREE.MathUtils.smoothstep(s, 0.04, 0.18);
    const focusY = THREE.MathUtils.lerp(centerY, floorY, blend);

    camera.position.y = THREE.MathUtils.lerp(camera.position.y, focusY + 0.5, camK);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6 + ascend * 1.5, camK);
    lookY.current = THREE.MathUtils.lerp(lookY.current, focusY, camK);
    camera.lookAt(0, lookY.current, 0);
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#fff6e0" />
      <pointLight position={[-4, 1, 4]} intensity={0.8} color="#d4af37" />
      <pointLight position={[4, -1, 3]} intensity={0.4} color="#7aa2ff" />
      <spotLight position={[0, 10, 2]} angle={0.5} penumbra={0.9} intensity={0.7} color="#d4af37" />

      {/* Glossy ground — reflects environment lighting cheaply (no per-frame re-render) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.32, 0]}>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial color="#0a1220" metalness={0.92} roughness={0.32} envMapIntensity={1.1} />
      </mesh>
      {/* Soft gold pool of light under the tower */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.31, 0]}>
        <circleGeometry args={[3.2, 48]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.06} />
      </mesh>

      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Base platform */}
        <mesh position={[0, -2.25, 0]}>
          <cylinderGeometry args={[2.4, 2.7, 0.18, 48]} />
          <meshStandardMaterial color="#0b1424" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Glowing gold ring around base */}
        <mesh position={[0, -2.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.55, 0.025, 12, 80]} />
          <meshStandardMaterial
            color="#d4af37"
            emissive="#d4af37"
            emissiveIntensity={1.4}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Building floors */}
        {FLOORS.map((floor, i) => (
          <BuildingFloor
            key={floor.label}
            position={[0, floorPositions[i].y, 0]}
            size={[1.7, floorPositions[i].height, 1.3]}
            active={activeFloor === i}
            index={i}
            getOffset={() => offsetFor(i)}
            onSelect={() => onSelect(i)}
          />
        ))}

        {/* Spire / antenna on top */}
        <group ref={roofRef} position={[0, topY + 0.35, 0]}>
          <mesh>
            <coneGeometry args={[1.1, 0.5, 4]} />
            <meshStandardMaterial color="#0b1424" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0, 0.88, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#ffe9a8" emissive="#d4af37" emissiveIntensity={3} />
          </mesh>
        </group>

        {/* Floating particles around building */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const radius = 2.2 + Math.sin(i * 1.7) * 0.7;
          const height = -1.8 + (i / 16) * 4.5;
          return (
            <FloatingParticle
              key={i}
              initialPosition={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}
              speed={0.3 + (i % 5) * 0.08}
              index={i}
            />
          );
        })}
      </group>

      <Environment preset="city" />
    </>
  );
}

function FloatingParticle({
  initialPosition,
  speed,
  index,
}: {
  initialPosition: [number, number, number];
  speed: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = initialPosition[0] + Math.sin(t + index) * 0.3;
    ref.current.position.y = initialPosition[1] + Math.sin(t * 0.7 + index * 2) * 0.4;
    ref.current.position.z = initialPosition[2] + Math.cos(t + index) * 0.3;
  });

  return (
    <mesh ref={ref} position={initialPosition}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color={index % 3 === 0 ? "#d4af37" : "#ffffff"} transparent opacity={0.5} />
    </mesh>
  );
}
