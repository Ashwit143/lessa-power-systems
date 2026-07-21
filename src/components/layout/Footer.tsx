import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import type { AppSettings } from "@/services/settings.service";

const PRODUCT_LINKS = [
  { href: "/products/battery", label: "Batteries" },
  { href: "/products/inverter", label: "Inverters" },
  { href: "/products/solar", label: "Solar Systems" },
  { href: "/products/combo", label: "Combos & Bundles" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/solar", label: "Solar Solutions" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer({ settings }: { settings?: AppSettings }) {
  const currentYear = new Date().getFullYear();
  
  const businessName = settings?.companyName || SITE_CONFIG.businessName;
  const email = settings?.email || SITE_CONFIG.email;
  const primaryPhone = settings?.primaryPhone || SITE_CONFIG.primaryPhone;
  const address = settings?.address || SITE_CONFIG.address.full;

  return (
    <footer className="bg-neutral-900 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="container-site py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Image
                src="/banners/logo.png"
                alt="Leesa Power Systems"
                width={200}
                height={50}
                className="h-10 w-auto object-contain bg-white/5 p-1 rounded-sm"
              />
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              Authorized Luminous distributor serving Hyderabad since 2009. Genuine products, local service, WhatsApp-first ordering.
            </p>

            {/* Follow Us */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Follow Us</h3>
              <div className="flex items-center gap-4" aria-label="Social media links">
                <a
                  href="https://www.instagram.com/leesapowersystems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-white/10"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a
                  href="https://www.facebook.com/share/1DDvgimUwQ/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-white/10"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a
                  href="https://www.youtube.com/@leesasolarsolutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-white/10"
                  aria-label="Follow us on YouTube"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
                <a
                  href="https://www.threads.com/@leesapowersystems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-white/10 flex items-center justify-center"
                  aria-label="Follow us on Threads"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"/>
                    <path d="M12 9V2"/>
                    <path d="M12 15V22"/>
                    <path d="M5.5 5.5L8.5 8.5"/>
                    <path d="M15.5 15.5L18.5 18.5"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Products</h3>
            <ul className="space-y-2.5" role="list">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5" role="list">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3" role="list">
              <li>
                <a
                  href={`tel:${primaryPhone}`}
                  className="flex items-start gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors group"
                  aria-label={`Call ${primaryPhone}`}
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" aria-hidden="true" />
                  <span>{primaryPhone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors group"
                  aria-label={`Email ${email}`}
                >
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" aria-hidden="true" />
                  {email}
                </a>
              </li>
              <li>
                <address className="not-italic flex items-start gap-2.5 text-sm text-neutral-400">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="whitespace-pre-wrap">{address}</span>
                </address>
              </li>
            </ul>

            <p className="mt-4 text-xs text-neutral-500">
              Serving Hyderabad & Twin Cities
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-500">
          <p>
            © {currentYear} {businessName}. All rights reserved.
          </p>
          <p>
            Authorized Luminous Distributor · Hyderabad, Telangana
          </p>
        </div>
      </div>
    </footer>
  );
}
