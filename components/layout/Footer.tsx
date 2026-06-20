import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import { company } from "@/data/company";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";

const socialIcons: Record<string, LucideIcon> = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Facebook,
};

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink pb-[calc(env(safe-area-inset-bottom)+5.5rem)] pt-16 text-white/80 md:pb-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="Vyntra Property Services — home"
              className="inline-flex items-center gap-3"
            >
              <Image
                src="/logo-mark.svg"
                alt=""
                width={810}
                height={554}
                unoptimized
                className="h-11 w-auto"
              />
              <span className="flex flex-col leading-none">
                <span className="text-2xl font-bold tracking-tight text-white">
                  VYNTRA
                </span>
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-gold-soft">
                  Property Services
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {company.tagline}. Premium property maintenance and cleaning,
              trusted by property managers, strata managers and businesses across
              Sydney.
            </p>
            <div className="mt-5 flex gap-2">
              {company.socials.map((s) => {
                const Ico = socialIcons[s.label];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold"
                  >
                    {Ico ? <Ico className="h-4 w-4" /> : s.label.charAt(0)}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-white/60 transition-colors hover:text-gold"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/60 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${company.phone}`} className="hover:text-gold">
                  {company.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${company.email}`} className="hover:text-gold">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  {company.address.suburb}, {company.address.state}{" "}
                  {company.address.postcode}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>Mon–Fri 7am–6pm · Sat 8am–4pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>
              © {year} {company.legalName}. ABN {company.abn}. All rights
              reserved.
            </p>
            <p>
              Powered by{" "}
              <span className="font-semibold text-gold/80">Vyntra OS</span>
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gold">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gold">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
