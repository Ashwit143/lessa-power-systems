import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, CheckCircle, Clock, ShieldCheck, Zap } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { AboutGallery } from "@/features/about/AboutGallery";

export const metadata: Metadata = {
  title: `About Us — ${SITE_CONFIG.businessName}`,
  description: `Learn about ${SITE_CONFIG.businessName}, Hyderabad's trusted authorized Luminous distributor since ${SITE_CONFIG.established}. Supplying genuine inverters, batteries, and solar solutions.`,
  alternates: { canonical: `${SITE_CONFIG.siteUrl}/about` },
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    description: "As an authorized Luminous distributor, we guarantee that every inverter, battery, and solar panel is 100% genuine with full manufacturer warranty.",
  },
  {
    icon: Clock,
    title: "Fast Local Service",
    description: "Based in Nizampet, we provide rapid delivery and installation services across Hyderabad and twin cities.",
  },
  {
    icon: Award,
    title: "Expert Guidance",
    description: "With over a decade of experience, our technical team helps you choose the exact capacity you need—no overselling.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="bg-white border-b border-neutral-200">
        <div className="container-site py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="section-eyebrow">Our Story</span>
            <h1 className="text-page text-neutral-900 mt-2 mb-6">
              Powering Hyderabad Since {SITE_CONFIG.established}
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {SITE_CONFIG.businessName} is one of Hyderabad's most trusted authorized Luminous channel partners. 
              We specialize in providing reliable power backup and solar solutions for homes, businesses, and industrial applications.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary-900 text-white border-y border-primary-800">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-primary-800">
            <div className="px-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{SITE_CONFIG.stats.yearsInBusiness}+</div>
              <div className="text-sm text-primary-200 uppercase tracking-wider font-semibold">Years of Trust</div>
            </div>
            <div className="px-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{SITE_CONFIG.stats.customers}</div>
              <div className="text-sm text-primary-200 uppercase tracking-wider font-semibold">Happy Customers</div>
            </div>
            <div className="px-4 text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{SITE_CONFIG.stats.dealers}</div>
              <div className="text-sm text-primary-200 uppercase tracking-wider font-semibold">Dealer Network</div>
            </div>
            <div className="px-4 text-center flex flex-col justify-center">
              <div className="flex justify-center mb-2">
                <Zap className="h-8 w-8 text-accent" aria-hidden="true" />
              </div>
              <div className="text-sm text-primary-200 uppercase tracking-wider font-semibold">Authorized Partner</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-site">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why Choose Us?</h2>
            <p className="text-neutral-600">
              When you buy from an authorized distributor like {SITE_CONFIG.businessName}, you're not just buying a product—you're investing in peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="card-base p-8">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-primary-700" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{value.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <AboutGallery />

      {/* CTA */}
      <section className="py-16 bg-white border-t border-neutral-200">
        <div className="container-site">
          <div className="max-w-4xl mx-auto bg-neutral-50 rounded-2xl p-8 md:p-12 text-center border border-neutral-200">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">Ready to upgrade your power backup?</h2>
            <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
              Whether you need a simple home inverter or a full roof-top solar installation, our team is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
