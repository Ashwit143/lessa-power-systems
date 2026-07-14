import Link from "next/link";
import { Phone, Mail, MapPin, Zap } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

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

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="container-site py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <div className="flex items-center justify-center w-9 h-9 bg-primary-700 rounded-md group-hover:bg-primary-600 transition-colors">
                <Zap className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Leesa Power Systems</p>
                <p className="text-xs text-neutral-400 leading-tight">Since {SITE_CONFIG.established}</p>
              </div>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              Authorized Luminous distributor serving Hyderabad since 2009. Genuine products, local service, WhatsApp-first ordering.
            </p>

            {/* Social links — shown when client provides URLs */}
            {(SITE_CONFIG.socialLinks.instagram || SITE_CONFIG.socialLinks.facebook || SITE_CONFIG.socialLinks.youtube) && (
              <div className="flex items-center gap-3 mt-4" aria-label="Social media links">
                {SITE_CONFIG.socialLinks.instagram && (
                  <a
                    href={SITE_CONFIG.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors border border-white/10"
                    aria-label="Follow us on Instagram"
                  >
                    Instagram
                  </a>
                )}
                {SITE_CONFIG.socialLinks.facebook && (
                  <a
                    href={SITE_CONFIG.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors border border-white/10"
                    aria-label="Follow us on Facebook"
                  >
                    Facebook
                  </a>
                )}
                {SITE_CONFIG.socialLinks.youtube && (
                  <a
                    href={SITE_CONFIG.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors border border-white/10"
                    aria-label="Follow us on YouTube"
                  >
                    YouTube
                  </a>
                )}
              </div>
            )}
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
                  href={`tel:+91${SITE_CONFIG.phones[0]}`}
                  className="flex items-start gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors group"
                  aria-label={`Call ${SITE_CONFIG.phones[0]}`}
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" aria-hidden="true" />
                  <span>
                    {SITE_CONFIG.phones[0]}<br />
                    {SITE_CONFIG.phones[1]}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-start gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors group"
                  aria-label={`Email ${SITE_CONFIG.email}`}
                >
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" aria-hidden="true" />
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <address className="not-italic flex items-start gap-2.5 text-sm text-neutral-400">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>{SITE_CONFIG.address.full}</span>
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
            © {currentYear} {SITE_CONFIG.businessName}. All rights reserved.
          </p>
          <p>
            Authorized Luminous Distributor · Hyderabad, Telangana
          </p>
        </div>
      </div>
    </footer>
  );
}
