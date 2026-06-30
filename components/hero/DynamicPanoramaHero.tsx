"use client";

import dynamic from "next/dynamic";

/**
 * The panorama hero relies on `window`/WebGL, so it must render client-side only.
 * A lightweight ink placeholder holds the layout until it loads.
 */
const PanoramaHero = dynamic(
  () => import("./PanoramaHero").then((m) => m.PanoramaHero),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[100svh] w-full items-center justify-center bg-ink">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    ),
  }
);

export { PanoramaHero };
