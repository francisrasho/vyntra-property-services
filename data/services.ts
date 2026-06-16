import type { Service } from "./types";

/** The 9 Vyntra service lines. Copy is conversion-focused and SEO-aware. */
export const services: Service[] = [
  {
    slug: "commercial-cleaning",
    name: "Commercial Cleaning",
    icon: "Building2",
    tagline: "Spotless commercial spaces, every single day.",
    description:
      "Reliable, presentation-perfect cleaning for retail, hospitality, medical and commercial premises across Sydney.",
    problem:
      "First impressions are won or lost at the front door. Inconsistent cleaners, missed scopes and no accountability leave your premises looking tired and your customers questioning your standards.",
    solution:
      "Vyntra delivers consistent, audited commercial cleaning with documented scopes, trained contractors and digital quality reporting — so your space always looks the part and you always know it was done.",
    benefits: [
      "Fully insured, police-checked contractors",
      "Digital checklists and photo verification on every visit",
      "Flexible schedules — daily, after-hours or weekend",
      "Dedicated account manager and rapid issue resolution",
    ],
    process: [
      { title: "Site assessment", detail: "We walk your premises and build a documented cleaning scope tailored to your space." },
      { title: "Tailored schedule", detail: "Daily, nightly or weekly — timed around your operating hours." },
      { title: "Audited delivery", detail: "Every clean is checklisted and photo-verified in our system." },
      { title: "Ongoing review", detail: "Your account manager reviews quality and adjusts as your needs change." },
    ],
    idealFor: ["Retail & showrooms", "Medical & allied health", "Hospitality venues", "Commercial offices"],
    keywords: ["commercial cleaning sydney", "office cleaning sydney", "cleaning services sydney"],
  },
  {
    slug: "office-cleaning",
    name: "Office Cleaning",
    icon: "Briefcase",
    tagline: "A workplace your team is proud to walk into.",
    description:
      "Discreet, detail-driven office cleaning that keeps workspaces healthy, hygienic and professional.",
    problem:
      "Dusty desks, overflowing bins and grimy kitchens quietly erode team morale and signal neglect to every client who visits.",
    solution:
      "We keep your office immaculate with after-hours cleaning crews, hospital-grade sanitisation of touchpoints and a consistent team that learns your space.",
    benefits: [
      "After-hours service — zero disruption to your team",
      "Sanitised high-touch points and shared kitchens",
      "Consumables management (handwash, paper, bins)",
      "Consistent crews who know your floorplan",
    ],
    process: [
      { title: "Walkthrough", detail: "We map your floors, meeting rooms, kitchens and amenities." },
      { title: "Scope & quote", detail: "Transparent, itemised pricing with no lock-in surprises." },
      { title: "Nightly cleaning", detail: "Crews work after hours so mornings start spotless." },
      { title: "Monthly review", detail: "We report on quality and refine the scope with you." },
    ],
    idealFor: ["Corporate offices", "Co-working spaces", "Professional services", "Tech & startups"],
    keywords: ["office cleaning sydney", "commercial cleaning sydney"],
  },
  {
    slug: "strata-cleaning",
    name: "Strata Cleaning",
    icon: "Building",
    tagline: "Common areas that lift the whole building.",
    description:
      "Comprehensive strata and common-area cleaning that protects asset value and keeps residents happy.",
    problem:
      "Lobbies, lifts, car parks and bin rooms are the spaces residents judge — and the ones owners complain about first when standards slip.",
    solution:
      "Vyntra manages every common area to a documented standard, with proactive reporting to strata and building managers so nothing is missed and everything is accountable.",
    benefits: [
      "Lobbies, lifts, stairwells, car parks and bin rooms",
      "Proactive reporting to strata & building managers",
      "Scheduled deep cleans and pressure washing",
      "One accountable partner for the whole property",
    ],
    process: [
      { title: "Building audit", detail: "We assess every common area and agree a documented standard." },
      { title: "Service plan", detail: "Routine cleans plus scheduled deep cleans and periodic works." },
      { title: "Managed delivery", detail: "Crews follow the plan; managers get clear reporting." },
      { title: "Partnership reviews", detail: "Regular reviews keep standards high as the building ages." },
    ],
    idealFor: ["Residential strata", "Mixed-use buildings", "Building managers", "Strata managers"],
    keywords: ["strata cleaning sydney", "common area cleaning", "building cleaning sydney"],
  },
  {
    slug: "property-maintenance",
    name: "Property Maintenance",
    icon: "Wrench",
    tagline: "One trusted partner for every property need.",
    description:
      "Planned and reactive maintenance that keeps your portfolio safe, compliant and running smoothly.",
    problem:
      "Juggling a dozen trades, chasing quotes and waiting days for callbacks turns small maintenance issues into expensive, reputation-damaging problems.",
    solution:
      "Vyntra is your single point of contact for property maintenance — coordinated trades, fast response, transparent pricing and a clear record of every job.",
    benefits: [
      "One point of contact for all trades",
      "Planned preventative and reactive maintenance",
      "Transparent, itemised quoting",
      "Full job history and documentation",
    ],
    process: [
      { title: "Log the request", detail: "Report an issue and we triage it immediately." },
      { title: "Scope & quote", detail: "You get a clear, itemised quote before work begins." },
      { title: "Coordinated works", detail: "We schedule the right trades and manage the job end to end." },
      { title: "Sign-off & record", detail: "Completed works are documented and reported back to you." },
    ],
    idealFor: ["Property managers", "Landlords", "Commercial owners", "Strata committees"],
    keywords: ["property maintenance sydney", "building maintenance sydney"],
  },
  {
    slug: "handyman-services",
    name: "Handyman Services",
    icon: "Hammer",
    tagline: "The jobs on your list — handled properly.",
    description:
      "Skilled, reliable handyman work for the repairs and improvements that keep properties presentable.",
    problem:
      "The little jobs — a broken hinge, a patch of render, a flickering light — pile up because no one reliable ever turns up when they say they will.",
    solution:
      "Our vetted handymen arrive on time, do the job right the first time, and leave the site clean — with a clear record of what was done.",
    benefits: [
      "Punctual, professional and tidy",
      "Repairs, installs, patching and finishing",
      "Right-first-time workmanship",
      "Photo records of completed work",
    ],
    process: [
      { title: "Tell us the job", detail: "Send through your list — big or small." },
      { title: "Schedule a visit", detail: "We book a time that suits and confirm in writing." },
      { title: "Get it done", detail: "Tidy, reliable work completed to a high standard." },
      { title: "Quality check", detail: "We document the finish and follow up if needed." },
    ],
    idealFor: ["Landlords", "Property managers", "Offices", "Retail fit-outs"],
    keywords: ["handyman sydney", "property repairs sydney"],
  },
  {
    slug: "pressure-washing",
    name: "Pressure Washing",
    icon: "Droplets",
    tagline: "Restore surfaces to like-new condition.",
    description:
      "High-pressure cleaning that strips away grime from facades, car parks, paths and outdoor areas.",
    problem:
      "Stained driveways, slippery walkways and dirty facades make a property look neglected — and create real safety and liability risks.",
    solution:
      "Vyntra's pressure-washing crews restore hard surfaces safely and thoroughly, improving presentation and reducing slip hazards across your property.",
    benefits: [
      "Facades, car parks, paths and courtyards",
      "Removes grime, oil, gum and biological growth",
      "Reduces slip and safety hazards",
      "Dramatic before-and-after results",
    ],
    process: [
      { title: "Assess the surface", detail: "We identify the right pressure and method for each material." },
      { title: "Prepare the area", detail: "We protect surrounds and manage water responsibly." },
      { title: "Wash & restore", detail: "Surfaces are cleaned thoroughly and evenly." },
      { title: "Final inspection", detail: "We capture the result and confirm you're delighted." },
    ],
    idealFor: ["Strata buildings", "Commercial premises", "Car parks", "Outdoor dining"],
    keywords: ["pressure washing sydney", "exterior cleaning sydney"],
  },
  {
    slug: "garden-maintenance",
    name: "Garden Maintenance",
    icon: "Leaf",
    tagline: "Grounds that always look cared for.",
    description:
      "Regular grounds and garden upkeep that keeps the exterior of your property sharp year-round.",
    problem:
      "Overgrown gardens and untidy grounds are the fastest way to make a quality property look unloved — and to attract complaints from tenants and owners.",
    solution:
      "Our grounds crews keep lawns, gardens and shared outdoor spaces immaculate with scheduled, reliable maintenance and seasonal care.",
    benefits: [
      "Lawns, hedges, garden beds and shared grounds",
      "Scheduled, reliable visits",
      "Seasonal planting and tidy-ups",
      "Green-waste removed and site left clean",
    ],
    process: [
      { title: "Grounds review", detail: "We assess the site and agree a maintenance schedule." },
      { title: "Set the schedule", detail: "Regular visits matched to the season and the site." },
      { title: "Maintain & tidy", detail: "Mowing, edging, pruning and clean-up every visit." },
      { title: "Seasonal care", detail: "We adapt the plan through the year to keep grounds sharp." },
    ],
    idealFor: ["Strata grounds", "Commercial landscapes", "Residential portfolios", "Body corporates"],
    keywords: ["garden maintenance sydney", "grounds maintenance sydney"],
  },
  {
    slug: "end-of-lease-cleaning",
    name: "End of Lease Cleaning",
    icon: "Sparkles",
    tagline: "Bond-back clean, guaranteed standard.",
    description:
      "Thorough end-of-lease cleans that meet agent and landlord standards and protect the bond.",
    problem:
      "A failed final inspection means lost bond, re-cleans and a frustrated tenant or landlord — all over details a professional would never miss.",
    solution:
      "Vyntra delivers comprehensive, checklist-driven end-of-lease cleaning built around agent requirements, so the property passes inspection the first time.",
    benefits: [
      "Agent-standard, checklist-driven cleaning",
      "Kitchens, bathrooms, interiors and detailing",
      "Re-clean support if an agent flags an issue",
      "Turn properties around fast between tenancies",
    ],
    process: [
      { title: "Confirm the scope", detail: "We align to the agent's inspection checklist." },
      { title: "Deep clean", detail: "Every room detailed to handover standard." },
      { title: "Inspection-ready", detail: "We document the finished result for your records." },
      { title: "Re-clean cover", detail: "If an agent flags anything, we return promptly." },
    ],
    idealFor: ["Property managers", "Landlords", "Tenants", "Real estate agencies"],
    keywords: ["end of lease cleaning sydney", "bond cleaning sydney", "vacate cleaning sydney"],
  },
  {
    slug: "emergency-property-support",
    name: "Emergency Property Support",
    icon: "Siren",
    tagline: "When something goes wrong, we move fast.",
    description:
      "Rapid-response support for urgent property issues — available when you need it most.",
    problem:
      "A flood, a break-in, a biohazard or storm damage can't wait for business hours. Slow response turns an incident into a catastrophe.",
    solution:
      "Vyntra's emergency response mobilises quickly to make properties safe, clean and secure — with clear communication every step of the way.",
    benefits: [
      "Rapid response across Sydney",
      "Make-safe, clean-up and securing",
      "Clear updates through the whole incident",
      "Coordination with insurers and trades",
    ],
    process: [
      { title: "Call it in", detail: "Reach our response line and we mobilise immediately." },
      { title: "Make safe", detail: "We secure the site and reduce further damage fast." },
      { title: "Restore", detail: "Clean-up and remediation handled end to end." },
      { title: "Report", detail: "Full documentation to support insurance and owners." },
    ],
    idealFor: ["Strata managers", "Property managers", "Commercial sites", "Landlords"],
    keywords: ["emergency cleaning sydney", "property emergency response sydney"],
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

export const serviceSlugs = services.map((s) => s.slug);
