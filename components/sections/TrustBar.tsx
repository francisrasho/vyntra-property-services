import { CheckCircle2 } from "lucide-react";

const indicators = [
  "Fully Insured",
  "Professional Contractors",
  "Fast Response Times",
  "Sydney Wide",
  "Quality Guaranteed",
];

export function TrustBar() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
      {indicators.map((label) => (
        <li
          key={label}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/75"
        >
          <CheckCircle2 className="h-4 w-4 text-gold" />
          {label}
        </li>
      ))}
    </ul>
  );
}
