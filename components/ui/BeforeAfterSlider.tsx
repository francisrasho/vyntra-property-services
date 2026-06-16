"use client";

import Image from "next/image";
import { useState } from "react";
import { MoveHorizontal } from "lucide-react";

/** Draggable before/after image comparison. A range input drives the reveal,
 *  giving free keyboard accessibility and 0–100 clamping. */
export function BeforeAfterSlider({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  const clamped = Math.min(100, Math.max(0, pos));

  return (
    <div className="relative aspect-[3/2] w-full select-none overflow-hidden rounded-2xl bg-ink">
      {/* Base: AFTER image */}
      <Image
        src={after}
        alt={`${alt} — after`}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 60vw"
      />
      {/* Overlay: BEFORE image, revealed on the right of the handle */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${clamped}%)` }}
      >
        <Image
          src={before}
          alt={`${alt} — before`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-gold/90 px-2.5 py-1 text-[11px] font-semibold text-ink">
        After
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-white">
        Before
      </span>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${clamped}%` }}
      >
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white/90" />
        <div className="absolute top-1/2 -ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-lg">
          <MoveHorizontal className="h-5 w-5" />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={clamped}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`${alt} — drag to compare before and after`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
