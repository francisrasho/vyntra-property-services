import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@photo-sphere-viewer/core",
    "@photo-sphere-viewer/markers-plugin",
    "@photo-sphere-viewer/autorotate-plugin",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      // Placeholder photography (swap for real Vyntra imagery later).
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
