# 360° Hero Panorama

The hero uses a real equirectangular 360° viewer
([Photo Sphere Viewer](https://photo-sphere-viewer.js.org/)).

## Replacing the placeholder

1. Export a **360° equirectangular** image — a **2:1** aspect ratio (e.g.
   `4096×2048` or `6000×3000`), JPG or WebP. Most 360 cameras (Insta360, Ricoh
   Theta) and renderers output this directly.
2. Drop it in this folder, e.g. `public/panorama/property.jpg`.
3. Point the viewer at it in `components/hero/panorama-data.ts`:

   ```ts
   export const PANORAMA_SRC = "/panorama/property.jpg";
   ```

That's the only change needed — the hotspots, panels and CTAs keep working.

## Using a 360° video

Photo Sphere Viewer also supports equirectangular video via its
`@photo-sphere-viewer/video-plugin` + `EquirectangularVideoAdapter`. Install the
plugin, set the adapter on the `Viewer` in `components/hero/PanoramaHero.tsx`,
and pass the video `source` instead of `panorama`.

## Positioning hotspots

Each service zone in `panorama-data.ts` has a `yaw` and `pitch` (degrees) that
place its hotspot in the scene. After swapping the image, nudge those values so
each marker lands on the right area of *your* property. `yaw` is the horizontal
angle (0–360), `pitch` the vertical (negative looks down).

The current `placeholder-property.jpg` is a generated stand-in, not a real
photo — replace it before launch.
