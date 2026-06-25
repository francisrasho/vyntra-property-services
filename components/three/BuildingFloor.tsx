"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const GOLD = new THREE.Color("#d4af37");

interface BuildingFloorProps {
  position: [number, number, number];
  size: [number, number, number];
  active: boolean;
  index: number;
  /** Called every frame to read the current explode offset (driven by scroll ref). */
  getOffset: () => number;
  /** Navigate to this floor's service page when clicked. */
  onSelect: () => void;
}

/** Builds a canvas texture of a grid of windows — most lit warm-gold, a few dark. */
function makeWindowTexture(cols: number, rows: number, seed: number) {
  const cell = 28;
  const w = cols * cell;
  const h = rows * cell;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Dark glass facade
  ctx.fillStyle = "#0a1020";
  ctx.fillRect(0, 0, w, h);

  // Deterministic-ish pseudo random so floors differ but are stable
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = rand() > 0.32;
      const pad = cell * 0.16;
      const x = c * cell + pad;
      const y = r * cell + pad;
      const size = cell - pad * 2;
      if (lit) {
        const warm = rand();
        ctx.fillStyle = warm > 0.55 ? "#f6d98a" : warm > 0.25 ? "#d4af37" : "#fff3d6";
      } else {
        ctx.fillStyle = "#121a2e";
      }
      ctx.fillRect(x, y, size, size);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function BuildingFloor({
  position,
  size,
  active,
  index,
  getOffset,
  onSelect,
}: BuildingFloorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const cols = Math.max(4, Math.round(size[0] * 4));
  const rows = Math.max(2, Math.round(size[1] * 8));
  const texture = useMemo(() => makeWindowTexture(cols, rows, index + 1), [cols, rows, index]);

  const baseEmissive = 0.5;
  const targetEmissive = active ? 1.2 : hovered ? 1.0 : baseEmissive;
  const targetScale = active ? 1.06 : hovered ? 1.03 : 1;

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const k = 1 - Math.pow(0.001, delta); // frame-rate independent lerp
    const targetY = position[1] + getOffset();
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, k);

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    // Active floor breathes brightly; others settle to their resting glow.
    const pulse = active ? 1.3 * (0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 2.6)) : 0;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive + pulse, k);

    const sc = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, k);
    meshRef.current.scale.x = sc;
    meshRef.current.scale.z = sc;

    if (glowRef.current) {
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      const activeOpacity = 0.18 + 0.14 * (0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 2.6));
      const targetOpacity = active ? activeOpacity : hovered ? 0.12 : 0;
      glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, targetOpacity, k);
      glowRef.current.position.y = meshRef.current.position.y;
    }
  });

  return (
    <group>
      <RoundedBox
        ref={meshRef}
        args={size}
        radius={0.04}
        smoothness={3}
        position={position}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <meshStandardMaterial
          map={texture}
          emissive={GOLD}
          emissiveMap={texture}
          emissiveIntensity={baseEmissive}
          metalness={0.35}
          roughness={0.45}
        />
      </RoundedBox>

      {/* Soft halo behind active/hovered floor */}
      <mesh
        ref={glowRef}
        position={position}
        scale={[size[0] + 0.35, size[1] + 0.12, size[2] + 0.35]}
      >
        <boxGeometry />
        <meshBasicMaterial color={GOLD} transparent opacity={0} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
