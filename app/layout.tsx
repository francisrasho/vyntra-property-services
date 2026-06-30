import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { QuoteModalProvider } from "@/components/forms/QuoteModalProvider";
import { JsonLd, localBusinessSchema } from "@/lib/seo";

/* The Property voice — architectural serif (production stand-in for Signifier). */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

/* The Working voice — neutral grotesque (deliberately NOT Inter/Geist). */
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

/* The System voice — monospace, reserved for Vyntra OS elements only. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Vyntra Property Services — Your property, on the record",
    template: "%s · Vyntra Property Services",
  },
  description:
    "Technology-enabled property maintenance and cleaning across Sydney. Every job scoped, checklisted and photo-verified — documented, accountable, on the record. Powered by Vyntra OS.",
  keywords: [
    "property maintenance sydney",
    "commercial cleaning sydney",
    "strata cleaning sydney",
    "office cleaning sydney",
    "handyman sydney",
    "cleaning services sydney",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "/",
    siteName: "Vyntra Property Services",
    title: "Vyntra Property Services — Your property, on the record",
    description:
      "Technology-enabled property maintenance and cleaning across Sydney. Every job documented, verified and accountable. Powered by Vyntra OS.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyntra Property Services — Your property, on the record",
    description:
      "Technology-enabled property care across Sydney. Documented, verified, accountable.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${plexMono.variable}`}
    >
      <body className="bg-travertine font-sans text-ink antialiased">
        <JsonLd data={localBusinessSchema()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-graphite focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ondark"
        >
          Skip to content
        </a>
        <QuoteModalProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </QuoteModalProvider>
      </body>
    </html>
  );
}
