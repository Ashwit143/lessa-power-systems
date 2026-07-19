"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { cn } from "@/utils/cn";
import { SITE_CONFIG } from "@/lib/config";
import { useCart } from "@/features/cart/CartContext";
import { TopContactBar } from "./TopContactBar";
import { NavbarSearch } from "./NavbarSearch";
import type { AppSettings } from "@/services/settings.service";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/products/battery", label: "Batteries" },
  { href: "/products/inverter", label: "Inverters" },
  { href: "/solar", label: "Solar" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface NavbarProps {
  settings?: AppSettings;
}

export function Navbar({ settings }: NavbarProps) {
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
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-white border-b border-neutral-100"
      )}
    >
      <TopContactBar settings={settings} />
      <div className="container-site">
        <div className="flex items-center h-[68px] gap-4 xl:gap-8 w-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md py-1"
            aria-label="Leesa Power Systems — Home"
          >
            <Image
              src="/banners/logo.png"
              alt="Leesa Power Systems"
              width={275}
              height={66}
              className="h-11 sm:h-[52px] w-auto object-contain transition-transform"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden xl:flex items-center gap-1 2xl:gap-2 flex-1 justify-start"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-[15px] font-semibold transition-colors duration-200 group whitespace-nowrap",
                    isActive ? "text-primary-700" : "text-neutral-600 hover:text-primary-700"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  <span className={cn(
                    "absolute left-3 right-3 -bottom-1 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ease-out",
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100"
                  )} />
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3 xl:gap-4 ml-auto flex-shrink-0">
            {/* Search - Desktop */}
            <div className="hidden lg:block w-[260px] xl:w-[300px]">
              <NavbarSearch />
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              aria-label={`Cart${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? "s" : ""}` : ""}`}
            >
              <ShoppingCart className="h-[22px] w-[22px]" aria-hidden="true" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-accent text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white"
                  aria-hidden="true"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="xl:hidden border-t border-neutral-100 bg-white/95 backdrop-blur-md shadow-lg animate-slide-up"
        >
          <div className="container-site pt-4 pb-2">
            <NavbarSearch />
          </div>
          <nav
            className="container-site py-2 flex flex-col gap-1 pb-4"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-md text-[15px] font-semibold transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
