// Central GSAP entry point. Registers the ScrollTrigger plugin once and the
// React `useGSAP` integration, then re-exports them so homepage section
// components share a single registered instance. Imported only by client
// components, so GSAP stays out of every other route's bundle.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
