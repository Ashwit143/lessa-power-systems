import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/features/cart/CartContext";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";

// ---------------------------------------------------------------------------
// Font — loaded at root to avoid FOUT on any route
// ---------------------------------------------------------------------------
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

// ---------------------------------------------------------------------------
// Root Metadata Defaults
// Overridden per-page via generateMetadata() or static metadata exports
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: `${SITE_CONFIG.businessName} — Authorized Luminous Distributor, Hyderabad`,
    template: `%s | ${SITE_CONFIG.businessName}`,
  },
  description:
    "Leesa Power Systems is Hyderabad's trusted Luminous distributor. Shop genuine Luminous inverters, batteries, and solar systems. WhatsApp ordering, local service, 25,000+ customers since 2009.",
  keywords: [
    "Luminous distributor Hyderabad",
    "inverter battery Hyderabad",
    "solar installation Hyderabad",
    "Leesa Power Systems",
    "Luminous inverter Hyderabad",
    "home UPS Hyderabad",
    "Nizampet power systems",
  ],
  authors: [{ name: SITE_CONFIG.businessName }],
  creator: SITE_CONFIG.businessName,
  publisher: SITE_CONFIG.businessName,

  // Open Graph defaults
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.siteUrl,
    siteName: SITE_CONFIG.businessName,
    title: `${SITE_CONFIG.businessName} — Authorized Luminous Distributor, Hyderabad`,
    description:
      "Shop genuine Luminous inverters, batteries, and solar systems in Hyderabad. WhatsApp ordering, local service, 25,000+ customers since 2009.",
    images: [
      {
        url: "/images/og-default.webp",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.businessName} — Luminous Distributor Hyderabad`,
      },
    ],
  },

  // Twitter Card defaults
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.businessName} — Authorized Luminous Distributor, Hyderabad`,
    description:
      "Shop genuine Luminous inverters, batteries, and solar systems in Hyderabad.",
    images: ["/images/og-default.webp"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  // Verification (add once GSC is set up)
  // verification: { google: "GOOGLE_VERIFICATION_CODE" },

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// ---------------------------------------------------------------------------
// Root Layout
// ---------------------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={manrope.variable} suppressHydrationWarning>
      <body className="antialiased">
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-manrope)",
                fontSize: "0.875rem",
              },
              classNames: {
                toast: "rounded-lg",
                success: "border-l-4 border-success",
                error: "border-l-4 border-error",
              },
            }}
            richColors
          />
        </CartProvider>
      </body>
    </html>
  );
}
