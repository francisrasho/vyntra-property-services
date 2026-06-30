"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const GLASS_TINT = new THREE.Color("#0c1a30");
const INTERIOR = new THREE.Color("#ffb867");
const HALO = new THREE.Color("#d4af37");

interface BuildingFloorProps {
  position: [number, number, number];
  size: [number, number, number];
  active: boolean;
  /** True when another floor is active — this one quiets so the active service stands out. */
  dimmed?: boolean;
  index: number;
  /** Called every frame to read the current explode offset (driven by scroll ref). */
  getOffset: () => number;
  /** Navigate to this floor's service page when clicked. */
  onSelect: () => void;
}

/**
 * Paints a realistic glass curtain-wall facade.
 *  - `map`      : reflective dark glass with a vertical sky-gradient, fine steel
 *                 mullions and spandrel lines — reads as a real facade at distance.
 *  - `emissive` : mostly black, with a minority of softly-lit warm interiors so
 *                 the building has warm interior lighting glimpsed through glass
 *                 rather than glowing arcade squares.
 */
function makeFacadeTextures(cols: number, rows: number, seed: number) {
  const cell = 40;
  const w = cols * cell;
  const h = rows * cell;

  const map = document.createElement("canvas");
  map.width = w;
  map.height = h;
  const mc = map.getContext("2d")!;

  const emi = document.createElement("canvas");
  emi.width = w;
  emi.height = h;
  const ec = emi.getContext("2d")!;
  ec.fillStyle = "#000000";
  ec.fillRect(0, 0, w, h);

  // Base glass: a vertical gradient so the surface reads as sky reflected in glass
  // (cooler/lighter toward the top, deeper toward the base).
  const grad = mc.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#35476a");
  grad.addColorStop(0.5, "#1b2a45");
  grad.addColorStop(1, "#0b1424");
  mc.fillStyle = grad;
  mc.fillRect(0, 0, w, h);

  // Deterministic pseudo-random so floors differ yet stay stable across renders.
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const inset = cell * 0.1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cell + inset;
      const y = r * cell + inset;
      const pw = cell - inset * 2;
      const ph = cell - inset * 2;

      // Per-pane glass shading — a faint diagonal sheen varies each pane subtly.
      const sheen = mc.createLinearGradient(x, y, x + pw, y + ph);
      const tint = 0.05 + rand() * 0.07;
      sheen.addColorStop(0, `rgba(150,180,220,${tint})`);
      sheen.addColorStop(0.5, "rgba(10,16,28,0)");
      sheen.addColorStop(1, `rgba(6,10,18,${0.12 + rand() * 0.1})`);
      mc.fillStyle = sheen;
      mc.fillRect(x, y, pw, ph);

      // A minority of panes show a warm, soft interior glow (lit rooms).
      if (rand() > 0.68) {
        const warm = rand();
        const col = warm > 0.6 ? "255,206,138" : warm > 0.3 ? "255,176,96" : "255,228,176";
        // Soft radial pool so the light reads as a room behind glass, not a flat square.
        const cx = x + pw / 2;
        const cy = y + ph * 0.58;
        const rg = ec.createRadialGradient(cx, cy, 1, cx, cy, pw * 0.85);
        rg.addColorStop(0, `rgba(${col},0.95)`);
        rg.addColorStop(0.6, `rgba(${col},0.45)`);
        rg.addColorStop(1, `rgba(${col},0)`);
        ec.fillStyle = rg;
        ec.fillRect(x - inset, y - inset, cell, cell);
        // Echo a touch of warmth into the colour map so lit glass isn't pure dark.
        mc.fillStyle = `rgba(${col},0.16)`;
        mc.fillRect(x, y, pw, ph);
      }
    }
  }

  // Steel mullions — slim vertical members and thinner horizontal spandrel lines.
  mc.fillStyle = "rgba(8,12,20,0.85)";
  for (let c = 0; c <= cols; c++) {
    mc.fillRect(c * cell - 1.5, 0, 3, h);
  }
  mc.fillStyle = "rgba(6,10,16,0.7)";
  for (let r = 0; r <= rows; r++) {
    mc.fillRect(0, r * cell - 1, w, 2);
  }
  // Brushed highlight on the left edge of each mullion catches the key light.
  mc.fillStyle = "rgba(190,205,230,0.10)";
  for (let c = 0; c <= cols; c++) {
    mc.fillRect(c * cell - 1.5, 0, 1, h);
  }

  const mapTex = new THREE.CanvasTexture(map);
  mapTex.colorSpace = THREE.SRGBColorSpace;
  mapTex.anisotropy = 8;
  const emiTex = new THREE.CanvasTexture(emi);
  emiTex.colorSpace = THREE.SRGBColorSpace;
  emiTex.anisotropy = 8;
  return { map: mapTex, emissive: emiTex };
}

export function BuildingFloor({
  position,
  size,
  active,
  dimmed = false,
  index,
  getOffset,
  onSelect,
}: BuildingFloorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const cols = Math.max(5, Math.round(size[0] * 5));
  const rows = Math.max(3, Math.round(size[1] * 9));
  const { map, emissive } = useMemo(
    () => makeFacadeTextures(cols, rows, index + 1),
    [cols, rows, index]
  );

  const baseEmissive = 0.46;
  // The active service surges warm; the rest of the property quiets right down so
  // the visitor watches what's happening, not the sculpture.
  const targetEmissive = active ? 1.35 : dimmed ? 0.18 : hovered ? 0.7 : baseEmissive;
  const targetScale = active ? 1.045 : hovered ? 1.018 : 1;

  // Concrete floor plates sit just proud of the glass to read as structural slabs.
  const slabW = size[0] + 0.07;
  const slabD = size[2] + 0.07;
  const slabH = 0.035;
  const slabTopY = size[1] / 2 - slabH / 2;

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !glassRef.current) return;
    const k = 1 - Math.pow(0.0015, delta); // frame-rate independent lerp
    const targetY = position[1] + getOffset();
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, k);

    const mat = glassRef.current.material as THREE.MeshPhysicalMaterial;
    // Active floor glows a touch warmer; the pulse is gentle, not arcade-bright.
    const pulse = active ? 0.18 * (0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 1.6)) : 0;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive + pulse, k);

    const sc = THREE.MathUtils.lerp(glassRef.current.scale.x, targetScale, k);
    glassRef.current.scale.x = sc;
    glassRef.current.scale.z = sc;

    if (glowRef.current) {
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      const activeOpacity = 0.1 + 0.05 * (0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 1.6));
      const targetOpacity = active ? activeOpacity : hovered ? 0.06 : 0;
      glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, targetOpacity, k);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <RoundedBox
        ref={glassRef}
        args={size}
        radius={0.02}
        smoothness={4}
        castShadow
        receiveShadow
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
        <meshPhysicalMaterial
          map={map}
          color={GLASS_TINT}
          metalness={0}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.14}
          reflectivity={0.65}
          ior={1.45}
          envMapIntensity={1.55}
          emissive={INTERIOR}
          emissiveMap={emissive}
          emissiveIntensity={baseEmissive}
        />
      </RoundedBox>

      {/* Concrete floor plates — top and bottom edges read as structural slabs. */}
      <mesh position={[0, slabTopY, 0]} castShadow receiveShadow>
        <boxGeometry args={[slabW, slabH, slabD]} />
        <meshStandardMaterial color="#8c8576" roughness={0.92} metalness={0.02} envMapIntensity={0.3} />
      </mesh>
      <mesh position={[0, -slabTopY, 0]} castShadow receiveShadow>
        <boxGeometry args={[slabW, slabH, slabD]} />
        <meshStandardMaterial color="#7e7768" roughness={0.94} metalness={0.02} envMapIntensity={0.3} />
      </mesh>

      {/* Soft halo behind the active/hovered floor — subtle, not neon. */}
      <mesh ref={glowRef} scale={[size[0] + 0.3, size[1] + 0.1, size[2] + 0.3]}>
        <boxGeometry />
        <meshBasicMaterial color={HALO} transparent opacity={0} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
