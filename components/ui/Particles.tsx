// Deterministic decorative particle field for dark sections. Positions are
// generated from a fixed seed so server and client markup match (no hydration
// mismatch), and it's static so it stays performant and screenshot-friendly.
const seeded = (i: number, salt: number) => {
  const v = Math.sin(i * salt) * 43758.5453;
  return v - Math.floor(v);
};

const DOTS = Array.from({ length: 64 }, (_, i) => ({
  x: seeded(i + 1, 12.9898) * 100,
  y: seeded(i + 1, 78.233) * 100,
  r: 0.4 + seeded(i + 1, 37.719) * 1.6,
  o: 0.05 + seeded(i + 1, 9.137) * 0.35,
  gold: i % 6 === 0,
}));

export function Particles({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={"pointer-events-none absolute inset-0 overflow-hidden " + (className ?? "")}
    >
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {DOTS.map((d, i) => (
          <circle
            key={i}
            cx={`${d.x}%`}
            cy={`${d.y}%`}
            r={d.r}
            fill={d.gold ? "var(--color-gold)" : "#ffffff"}
            opacity={d.o}
          />
        ))}
      </svg>
    </div>
  );
}
