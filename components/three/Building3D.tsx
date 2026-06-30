"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, SoftShadows } from "@react-three/drei";
import * as THREE from "three";
import { BuildingFloor } from "./BuildingFloor";

/** Baked soft contact shadow — a radial gradient on a plane. Renders identically
 *  on every GPU (no per-frame shadow buffer), grounding the tower in space. */
function makeShadowTexture() {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(0,0,0,0.7)");
  g.addColorStop(0.45, "rgba(0,0,0,0.42)");
  g.addColorStop(0.78, "rgba(0,0,0,0.12)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

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
  isMobile?: boolean;
}

export function Building3D({ scrollRef, activeFloor, mouseRef, onSelect, isMobile = false }: Building3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const lookY = useRef(0);
  // Smoothed pointer so parallax feels weighted, never twitchy.
  const smoothMouse = useRef({ x: 0, y: 0 });
  const shadowTex = useMemo(() => makeShadowTexture(), []);

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
    // Heavier, more "expensive" easing — the model settles slowly into place.
    const k = 1 - Math.pow(0.05, delta);
    const camK = 1 - Math.pow(0.0006, delta);
    const s = scrollRef.current ?? 0;
    const m = mouseRef.current ?? { x: 0, y: 0 };

    // Ease the raw pointer first so the rotation has real inertia.
    smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, m.x, k);
    smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, m.y, k);
    const sm = smoothMouse.current;

    if (groupRef.current) {
      const targetRotationY = -0.5 + sm.x * 0.34 + s * 0.35;
      const targetRotationX = 0.05 + sm.y * 0.1;
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

    const baseZ = isMobile ? 8.2 : 6;
    const zSpread = isMobile ? 2.2 : 1.5;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, focusY + 0.5, camK);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, baseZ + ascend * zSpread, camK);
    lookY.current = THREE.MathUtils.lerp(lookY.current, focusY, camK);
    camera.lookAt(0, lookY.current, 0);
  });

  return (
    <>
      {/* Atmospheric haze so the tower sits in real space and the floor recedes. */}
      <fog attach="fog" args={["#0a1120", 13, 34]} />

      {/* Architectural lighting: soft warm key + cool rim + gentle sky fill. */}
      <SoftShadows size={26} samples={12} focus={0.85} />
      <hemisphereLight intensity={0.34} color="#cdd9f5" groundColor="#0a0f1c" />
      <ambientLight intensity={0.1} />
      <directionalLight
        castShadow
        position={[6.5, 11, 6]}
        intensity={1.8}
        color="#fff1d4"
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-near={1}
        shadow-camera-far={42}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
      />
      {/* Cool rim from behind defines the steel edges. */}
      <directionalLight position={[-7, 5, -6]} intensity={0.6} color="#9db4ff" />
      {/* Soft warm wash low and to the side, like a developer-suite uplight. */}
      <spotLight position={[-3, 2, 5]} angle={0.7} penumbra={1} intensity={0.5} color="#ffd9a0" />

      {/* Calm stage floor — an unlit plane tuned to the background so it dissolves
          into dark space rather than forming a lit turntable pedestal. The property
          is the subject; grounding comes from the soft baked shadow below. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.36, 0]}>
        <circleGeometry args={[44, 96]} />
        <meshBasicMaterial color="#080d18" />
      </mesh>
      {/* Baked soft shadow pool grounds the tower without a bright reflective disc. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.16, 0]}>
        <planeGeometry args={[6, 4.4]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.8} />
      </mesh>

      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Slim matte base the footprint of the tower — a foot, not a pedestal.
            envMapIntensity 0 so it never reflects into a bright disc. */}
        <mesh position={[0, -2.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.16, 1.5]} />
          <meshStandardMaterial color="#10161f" metalness={0.1} roughness={0.85} envMapIntensity={0} />
        </mesh>

        {/* Building floors — the active service lights up while the rest of the
            property quiets, so attention follows what Vyntra is doing, not the form. */}
        {FLOORS.map((floor, i) => (
          <BuildingFloor
            key={floor.label}
            position={[0, floorPositions[i].y, 0]}
            size={[1.7, floorPositions[i].height, 1.3]}
            active={activeFloor === i}
            dimmed={activeFloor >= 0 && activeFloor !== i}
            index={i}
            getOffset={() => offsetFor(i)}
            onSelect={() => onSelect(i)}
          />
        ))}

        {/* Minimal rooftop plant — a slim, restrained cap. No spire, no beacon orb. */}
        <group ref={roofRef} position={[0, topY + 0.35, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.78, 0.18, 0.6]} />
            <meshStandardMaterial color="#2a3242" metalness={0.4} roughness={0.6} envMapIntensity={0.7} />
          </mesh>
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[0.34, 0.16, 0.28]} />
            <meshStandardMaterial color="#3a4456" metalness={0.5} roughness={0.55} envMapIntensity={0.7} />
          </mesh>
        </group>
      </group>

      {/* In-memory studio environment — true reflections in the glass, no network fetch. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#0a1120"]} />
        {/* Warm key panel behind the tower. */}
        <Lightformer form="rect" intensity={2.2} position={[0, 5, -9]} scale={[14, 7, 1]} color="#fff0d2" />
        {/* Cool fill on the left. */}
        <Lightformer form="rect" intensity={1.1} position={[-9, 2, 3]} scale={[6, 11, 1]} color="#aec6ff" />
        {/* Bright crisp strip on the right — the highlight that streaks down the glass. */}
        <Lightformer form="rect" intensity={1.6} position={[9, 3, 1]} scale={[5, 12, 1]} color="#ffffff" />
        {/* Soft low bounce. */}
        <Lightformer form="rect" intensity={0.6} position={[0, -5, 6]} scale={[12, 6, 1]} color="#7e93c4" />
        {/* Overhead-front panel — the soft reflection the camera-facing glass catches. */}
        <Lightformer form="rect" intensity={1.3} position={[1, 9, 7]} scale={[10, 4, 1]} color="#eaf0ff" />
      </Environment>
    </>
  );
}
