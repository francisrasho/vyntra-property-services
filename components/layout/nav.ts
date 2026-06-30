export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation — minimal, the same set on desktop and mobile. */
export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Records", href: "/records" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
