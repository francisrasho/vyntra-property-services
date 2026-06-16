export interface NavLink {
  label: string;
  href: string;
}

/** Condensed set shown in the desktop nav bar. */
export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "Gallery", href: "/gallery" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Full menu shown in the mobile drawer and footer. */
export const fullNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Why Choose Us", href: "/#why" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "Gallery", href: "/gallery" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];
