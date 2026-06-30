import Link from "next/link";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  PhoneCall,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { company } from "@/data/company";
import { services } from "@/data/services";
import { serviceAreas } from "@/data/serviceAreas";
import { Container } from "@/components/ui/Container";
import { MonoReadout } from "@/components/ui/os";

const socialIcons: Record<string, LucideIcon> = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Facebook,
};

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Records", href: "/records" },
  { label: "Contact", href: "/contact" },
];

const compliance = ["Fully insured", "Police-checked", "Public liability"];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-graphite pt-20 text-ondark-600">
      <Container>
        {/* Top: brand statement + live status */}
        <div className="flex flex-col gap-6 border-b border-line-dark pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <span className="font-mono text-lg font-medium uppercase tracking-[0.3em] text-ondark">
              Vyntra
            </span>
            <p className="mt-4 font-serif text-2xl leading-snug text-ondark">
              Your property, on the record.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className="breath inline-block h-2 w-2 rounded-full bg-verified"
              aria-hidden
            />
            <MonoReadout className="text-ondark-600">
              Vyntra OS · Operational
            </MonoReadout>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Services */}
          <nav aria-label="Services">
            <MonoReadout className="text-ondark-400">Services</MonoReadout>
            <ul className="mt-5 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-ondark-600 transition-colors hover:text-ondark"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Service areas */}
          <nav aria-label="Service areas">
            <MonoReadout className="text-ondark-400">Service areas</MonoReadout>
            <ul className="mt-5 space-y-2.5 text-sm">
              {serviceAreas.slice(0, 8).map((a) => (
                <li key={a.id} className="text-ondark-600">
                  {a.name}
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <MonoReadout className="text-ondark-400">Company</MonoReadout>
            <ul className="mt-5 space-y-2.5 text-sm">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-ondark-600 transition-colors hover:text-ondark"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/privacy"
                  className="text-ondark-600 transition-colors hover:text-ondark"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-ondark-600 transition-colors hover:text-ondark"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <MonoReadout className="text-ondark-400">Get in touch</MonoReadout>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                <a
                  href={`tel:${company.phone}`}
                  className="text-ondark-600 hover:text-ondark"
                >
                  {company.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-ondark-600 hover:text-ondark"
                >
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                <span>
                  {company.address.suburb}, {company.address.state}{" "}
                  {company.address.postcode}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                <span>Mon–Fri 7am–6pm · 24/7 emergencies</span>
              </li>
            </ul>

            <div className="mt-5 flex gap-2">
              {company.socials.map((s) => {
                const Ico = socialIcons[s.label];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-line-dark text-ondark-600 transition-colors hover:border-brass hover:text-brass"
                  >
                    {Ico ? <Ico className="h-4 w-4" /> : s.label.charAt(0)}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compliance badges */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line-dark py-6">
          <ShieldCheck className="h-4 w-4 text-brass" aria-hidden />
          {compliance.map((c) => (
            <MonoReadout key={c} className="text-ondark-600">
              {c}
            </MonoReadout>
          ))}
        </div>

        {/* Base rule */}
        <div className="flex flex-col gap-3 border-t border-line-dark py-6 text-xs text-ondark-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. ABN {company.abn}.
          </p>
          <p className="mono-readout text-[0.65rem]">
            Powered by Vyntra OS
          </p>
        </div>
      </Container>
    </footer>
  );
}
