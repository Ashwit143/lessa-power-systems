"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Phone, Zap } from "lucide-react";
import { cn } from "@/utils/cn";
import { SITE_CONFIG } from "@/lib/config";
import { useCart } from "@/features/cart/CartContext";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/products/battery", label: "Batteries" },
  { href: "/products/inverter", label: "Inverters" },
  { href: "/solar", label: "Solar" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll-aware nav shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-white transition-shadow duration-200",
        isScrolled ? "shadow-nav" : "border-b border-neutral-100"
      )}
    >
      <div className="container-site">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md"
            aria-label="Leesa Power Systems — Home"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-primary-700 rounded-md">
              <Zap className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-primary-700 leading-tight">
                Leesa Power Systems
              </p>
              <p className="text-xs text-neutral-500 leading-tight">
                Authorized Luminous Distributor
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link px-3 py-2 rounded-md text-sm",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "nav-link-active bg-primary-50"
                    : ""
                )}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Phone number — desktop */}
            <a
              href={`tel:+91${SITE_CONFIG.primaryPhone}`}
              className="hidden xl:flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors px-3 py-2 rounded-md hover:bg-primary-50"
              aria-label={`Call us: ${SITE_CONFIG.primaryPhone}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {SITE_CONFIG.primaryPhone}
            </a>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              aria-label={`Cart${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? "s" : ""}` : ""}`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center px-1"
                  aria-hidden="true"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-neutral-100 bg-white animate-slide-up"
        >
          <nav
            className="container-site py-4 flex flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-md text-sm font-semibold transition-colors",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-50"
                )}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile phone number */}
            <a
              href={`tel:+91${SITE_CONFIG.primaryPhone}`}
              className="mt-2 flex items-center gap-2 px-4 py-3 bg-primary-50 text-primary-700 rounded-md text-sm font-semibold"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call: {SITE_CONFIG.primaryPhone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
