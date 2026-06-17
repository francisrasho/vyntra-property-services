import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlassNav } from "@/components/layout/GlassNav";
import { Footer } from "@/components/layout/Footer";
import { FloatingQuoteButton } from "@/components/layout/FloatingQuoteButton";
import { MobileCallBar } from "@/components/layout/MobileCallBar";
import { QuoteModalProvider } from "@/components/forms/QuoteModalProvider";
import { ExitIntentPopup } from "@/components/forms/ExitIntentPopup";
import { JsonLd, localBusinessSchema } from "@/lib/seo";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Vyntra Property Services | Premium Property Maintenance & Cleaning, Sydney",
    template: "%s · Vyntra Property Services",
  },
  description:
    "Sydney's premium property maintenance and cleaning partner. Trusted by property managers, strata managers and businesses for reliable, fully insured, technology-driven service.",
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
    title:
      "Vyntra Property Services | Premium Property Maintenance & Cleaning, Sydney",
    description:
      "Sydney's premium property maintenance and cleaning partner — trusted by property managers, strata managers and businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyntra Property Services | Premium Property Services, Sydney",
    description:
      "Professional cleaning, maintenance and property solutions trusted across Sydney.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <JsonLd data={localBusinessSchema()} />
        <QuoteModalProvider>
          <ScrollProgress />
          <GlassNav />
          <main>{children}</main>
          <Footer />
          <FloatingQuoteButton />
          <MobileCallBar />
          <ExitIntentPopup />
        </QuoteModalProvider>
      </body>
    </html>
  );
}
