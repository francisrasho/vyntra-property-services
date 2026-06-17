export interface NavLink {
  label: string;
  href: string;
}

/** Condensed set shown in the desktop nav bar. */
export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/** Full menu shown in the mobile drawer and footer. */
export const fullNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Why Choose Us", href: "/about#why" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];
