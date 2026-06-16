import {
  Building2,
  Briefcase,
  Building,
  Wrench,
  Hammer,
  Droplets,
  Leaf,
  Sparkles,
  Siren,
  CalendarCheck,
  BadgeCheck,
  ShieldCheck,
  MessageSquare,
  Cpu,
  Receipt,
  CheckCircle2,
  Handshake,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Briefcase,
  Building,
  Wrench,
  Hammer,
  Droplets,
  Leaf,
  Sparkles,
  Siren,
  CalendarCheck,
  BadgeCheck,
  ShieldCheck,
  MessageSquare,
  Cpu,
  Receipt,
  CheckCircle2,
  Handshake,
};

/** Resolves a lucide icon name (from the data layer) to a rendered icon. */
export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? Building2;
  return <Cmp className={className} />;
}
