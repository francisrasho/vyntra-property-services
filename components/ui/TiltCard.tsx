"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/cn";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  intensity?: number;
  glowColor?: string;
}

export function TiltCard({
  children,
  className,
  intensity = 8,
  glowColor = "rgba(212,175,55,0.18)",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), {
    stiffness: 200,
    damping: 20,
  });

  const glowX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, ${glowColor}, transparent 55%)`;

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
    setHovered(false);
  }

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      className={cn("relative", className)}
    >
      {/* cursor-following glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{ background: glow, opacity: hovered ? 1 : 0 }}
      />
      <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }} className="relative h-full">
        {children}
      </div>
    </motion.div>
  );
}
