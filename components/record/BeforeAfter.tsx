import { Photo } from "@/components/ui/Photo";
import { MonoReadout } from "@/components/ui/os";

/**
 * Static before/after pair (Phase 1). The draggable Registration-reveal slider
 * arrives in Phase 2; the side-by-side is the accessible, launchable baseline.
 */
export function BeforeAfter({
  beforeSrc,
  afterSrc,
  alt,
}: {
  beforeSrc?: string;
  afterSrc?: string;
  alt: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <figure>
        <div className="overflow-hidden rounded-xl">
          <Photo
            src={beforeSrc}
            alt={`Before — ${alt}`}
            ratio="landscape"
            label="Before"
          />
        </div>
        <figcaption className="mt-2">
          <MonoReadout className="text-ink-400">Before</MonoReadout>
        </figcaption>
      </figure>
      <figure>
        <div className="overflow-hidden rounded-xl ring-1 ring-verified/30">
          <Photo
            src={afterSrc}
            alt={`After — ${alt}`}
            ratio="landscape"
            label="After"
          />
        </div>
        <figcaption className="mt-2">
          <MonoReadout className="text-verified">After</MonoReadout>
        </figcaption>
      </figure>
    </div>
  );
}
