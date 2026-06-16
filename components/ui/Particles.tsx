// Deterministic decorative particle field for dark sections. Uses an integer
// LCG (bit-identical across server and client, unlike Math.sin) and rounds the
// output, so SSR and hydration markup match exactly. Static => performant and
// screenshot-friendly.
function makeDots(count: number) {
  let s = 1337 >>> 0;
  const next = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  return Array.from({ length: count }, (_, i) => ({
    x: +(next() * 100).toFixed(2),
    y: +(next() * 100).toFixed(2),
    r: +(0.4 + next() * 1.6).toFixed(2),
    o: +(0.05 + next() * 0.35).toFixed(3),
    gold: i % 6 === 0,
  }));
}

const DOTS = makeDots(64);

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
