"use client";

import dynamic from "next/dynamic";

const BuildingScene = dynamic(
  () => import("./BuildingScene").then((m) => m.BuildingScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-ink">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="mt-4 text-sm text-white/40">Loading 3D experience...</p>
        </div>
      </div>
    ),
  }
);

export { BuildingScene };
