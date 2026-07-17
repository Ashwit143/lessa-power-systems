import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SolarLeadForm } from "@/features/solar/SolarLeadForm";
import { SolarSystemCards } from "@/features/solar/SolarSystemCards";
import { Accordion } from "@/components/ui/forms";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/config";
import { FAQS, getFAQsByCategory } from "@/data/faqs";
import { MessageCircle, Sun, CheckCircle, Star, MapPin, Award, Calendar, Phone } from "lucide-react";

// Statically rendered for maximum performance (ad landing page)
export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "Solar Installation Hyderabad — Free Quote | Leesa Power Systems",
  description:
    "Cut your electricity bill with Luminous solar systems. On-grid, off-grid, and hybrid solar installations in Hyderabad. Get a free quote on WhatsApp. Authorized Luminous solar partner.",
  alternates: { canonical: `${SITE_CONFIG.siteUrl}/solar` },
  openGraph: {
    title: "Solar Installation Hyderabad — Free Quote | Leesa Power Systems",
    description:
      "Reduce your electricity bill with solar. On-grid, off-grid, and hybrid Luminous solar systems for Hyderabad homes and offices.",
    url: `${SITE_CONFIG.siteUrl}/solar`,
  },
  // No index override — solar page should be indexed for organic traffic
  robots: { index: true, follow: true },
};

const HERO_HIGHLIGHTS = [
  "Residential / Household Solar",
  "Commercial & Industrial Solar",
  "Professional Installation",
  "Genuine Luminous Products",
  "Reliable After-Sales Support",
];

const TRUST_INDICATORS = [
  { icon: Award, label: "Authorized Distributor" },
  { icon: Calendar, label: `Since ${SITE_CONFIG.established}` },
  { icon: MapPin, label: "Local Installation" },
  { icon: Star, label: "Warranty Support" },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Free Consultation",
    description: "Tell us about your rooftop, monthly bill, and requirements on WhatsApp. We'll guide you to the right system.",
  },
  {
    step: "02",
    title: "Professional Installation",
    description: "Our certified engineers install panels, inverter, and wiring — typically in 1–2 days for residential systems.",
  },
  {
    step: "03",
    title: "After-Service Support",
    description: "We're with you after install — commissioning, AMC, warranty service, and ongoing technical support.",
  },
];

const solarFaqs = getFAQsByCategory("solar");

export default function SolarPage() {
  return (
    <>
      <main id="main-content">
        {/* ================================================================ */}
        {/* Hero — Separate desktop & mobile banners via next/image          */}
        {/* ================================================================ */}
        <section
          className="relative overflow-hidden"
          aria-labelledby="solar-hero-heading"
        >
          {/* Desktop banner (md and above) — preloaded as LCP element */}
          <div className="hidden md:block relative w-full" style={{ aspectRatio: "1717/916" }}>
            <Image
              src="/banners/solar-desktop.webp"
              alt="Solar panels installation — Leesa Power Systems"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          </div>

          {/* Mobile banner (below md) — preloaded as LCP element */}
          <div className="block md:hidden relative w-full" style={{ aspectRatio: "1024/1536" }}>
            <Image
              src="/banners/solar-mobile.webp"
              alt="Solar panels installation — Leesa Power Systems"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          </div>

          {/* Hero content — absolutely positioned over banner */}
          <div className="absolute inset-0 flex items-center">
            <div className="container-site w-full py-10 md:py-0">
              <div className="max-w-3xl">
                {/* Eyebrow */}
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="text-accent text-xs font-bold uppercase tracking-widest">
                    Solar Solutions — Hyderabad
                  </span>
                </div>

                {/* Heading */}
                <h1
                  id="solar-hero-heading"
                  className="text-hero text-white mb-4 text-balance"
                >
                  Complete Solar Power Solutions
                </h1>

                {/* Subheading */}
                <p className="text-white/85 text-base md:text-lg mb-6 leading-relaxed max-w-2xl">
                  We design, supply, install, and maintain reliable solar power solutions for homes, businesses, and commercial facilities.
                </p>

                {/* Highlight chips */}
                <ul className="flex flex-wrap gap-2 mb-8" aria-label="Service highlights">
                  {HERO_HIGHLIGHTS.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-white text-xs font-semibold"
                    >
                      <CheckCircle className="h-3 w-3 text-accent flex-shrink-0" aria-hidden="true" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="accent" size="lg" asChild>
                    <Link
                      href="/products/solar"
                      id="solar-hero-cta-primary"
                      aria-label="Explore solar products"
                    >
                      Explore Solar Products
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a
                      href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessages.solarEnquiry)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="solar-hero-cta-secondary"
                      aria-label="Get a free solar consultation on WhatsApp"
                      className="!text-white !border-white/50 hover:!bg-white/10"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Get a Free Consultation
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Lead Form */}
        {/* ================================================================ */}
        <section
          className="bg-white py-14"
          id="get-quote"
          aria-labelledby="lead-form-heading"
        >
          <div className="container-site">
            <div className="max-w-xl mx-auto">
              <div className="section-header mb-8">
                <span className="section-eyebrow">Quick enquiry</span>
                <h2 id="lead-form-heading" className="text-2xl font-bold text-neutral-900">
                  Tell Us About Your Requirements
                </h2>
                <p className="text-neutral-500 mt-2 text-sm">
                  Fill in the form below and we'll open WhatsApp with your details pre-filled.
                </p>
              </div>
              <SolarLeadForm />
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Solar System Types */}
        {/* ================================================================ */}
        <section
          className="section-padding bg-neutral-50"
          id="learn-more"
          aria-labelledby="systems-heading"
        >
          <div className="container-site">
            <div className="section-header">
              <span className="section-eyebrow">Choose your system</span>
              <h2 id="systems-heading" className="text-page text-neutral-900">
                On-Grid, Off-Grid, or Hybrid?
              </h2>
              <p className="text-neutral-500 mt-3">
                Each solar system type is designed for different needs. We'll help you choose the right one during your consultation.
              </p>
            </div>
            <SolarSystemCards />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Process */}
        {/* ================================================================ */}
        <section className="section-padding bg-white" aria-labelledby="process-heading">
          <div className="container-site">
            <div className="section-header">
              <span className="section-eyebrow">How it works</span>
              <h2 id="process-heading" className="text-page text-neutral-900">
                Your Solar Journey in 3 Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROCESS_STEPS.map((step) => (
                <div key={step.step} className="flex flex-col items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-700 text-white text-lg font-extrabold rounded-xl">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 text-lg mb-2">{step.title}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="accent" size="lg" asChild>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessages.solarEnquiry)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Start solar consultation on WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Start Your Free Consultation
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* FAQ */}
        {/* ================================================================ */}
        <section className="section-padding bg-neutral-50" aria-labelledby="faq-heading">
          <div className="container-site max-w-3xl">
            <div className="section-header">
              <span className="section-eyebrow">Common questions</span>
              <h2 id="faq-heading" className="text-page text-neutral-900">
                Solar FAQs
              </h2>
            </div>
            <Accordion items={solarFaqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Cross-sell — below main solar CTA, not competing */}
        {/* ================================================================ */}
        <section className="py-10 bg-white border-t border-neutral-100">
          <div className="container-site">
            <div className="max-w-lg mx-auto text-center p-6 bg-neutral-50 rounded-xl border border-neutral-200">
              <p className="text-sm font-semibold text-neutral-600 mb-2">
                Looking for winter backup power instead?
              </p>
              <h3 className="text-lg font-bold text-neutral-800 mb-3">
                Also Need a Backup Inverter?
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                Browse our range of Luminous home UPS inverters and batteries for reliable power during outages — even without solar.
              </p>
              <Button variant="outline" size="md" asChild>
                <Link href="/products/inverter">Browse Inverters</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Solar page footer — minimal */}
      <footer className="bg-neutral-900 py-6 text-center">
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} {SITE_CONFIG.businessName} ·{" "}
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
            Back to main site
          </Link>
        </p>
      </footer>
    </>
  );
}
