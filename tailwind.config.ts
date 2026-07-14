import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // -----------------------------------------------------------------------
      // Color System — Leesa Power Systems Design Tokens
      // -----------------------------------------------------------------------
      colors: {
        // Primary: Deep energetic blue (Luminous brand, modernized)
        primary: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#1046A8", // Main primary
          700: "#0B3D91", // Dark primary
          800: "#082E6E",
          900: "#051E4A",
          950: "#030F2A",
          DEFAULT: "#0B3D91",
        },

        // Accent: Warm amber — reserved ONLY for CTAs
        accent: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F5A623", // Main accent
          600: "#D97706",
          700: "#B45309",
          DEFAULT: "#F5A623",
        },

        // WhatsApp — isolated, used only for WhatsApp-specific elements
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#128C7E",
          light: "#DCF8C6",
        },

        // Neutral base — off-white background, premium charcoal text
        neutral: {
          50:  "#F8FAFC", // Page background
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#1A1A2E", // Main text
          950: "#0F0F1A",
          DEFAULT: "#1A1A2E",
        },

        // Surface colors
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F8FAFC",
          muted: "#F1F5F9",
        },

        // Status colors
        success: "#10B981",
        warning: "#F59E0B",
        error:   "#EF4444",
        info:    "#3B82F6",
      },

      // -----------------------------------------------------------------------
      // Typography — Manrope (loaded via next/font/google)
      // -----------------------------------------------------------------------
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },

      // -----------------------------------------------------------------------
      // Type Scale
      // -----------------------------------------------------------------------
      fontSize: {
        "hero":    ["clamp(2rem, 5vw, 3.5rem)",  { lineHeight: "1.1", fontWeight: "800" }],
        "page":    ["clamp(1.75rem, 4vw, 2.5rem)", { lineHeight: "1.2", fontWeight: "700" }],
        "section": ["clamp(1.375rem, 3vw, 1.875rem)", { lineHeight: "1.3", fontWeight: "700" }],
        "card":    ["1.125rem",  { lineHeight: "1.4", fontWeight: "600" }],
        "body":    ["1rem",      { lineHeight: "1.6", fontWeight: "400" }],
        "small":   ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "caption": ["0.75rem",  { lineHeight: "1.4", fontWeight: "400" }],
      },

      // -----------------------------------------------------------------------
      // Spacing Scale — 4px base grid
      // -----------------------------------------------------------------------
      spacing: {
        "1":  "4px",
        "2":  "8px",
        "3":  "12px",
        "4":  "16px",
        "6":  "24px",
        "8":  "32px",
        "12": "48px",
        "16": "64px",
        "18": "72px",
        "20": "80px",
        "24": "96px",
        "32": "128px",
      },

      // -----------------------------------------------------------------------
      // Border Radius — consistent rounding system
      // -----------------------------------------------------------------------
      borderRadius: {
        "none":  "0px",
        "sm":    "6px",   // Small elements (tags, badges)
        "DEFAULT": "8px", // Buttons, inputs
        "md":    "8px",
        "lg":    "12px",  // Cards
        "xl":    "16px",  // Modals, drawers
        "2xl":   "20px",
        "full":  "9999px",
      },

      // -----------------------------------------------------------------------
      // Box Shadows — subtle elevation system
      // -----------------------------------------------------------------------
      boxShadow: {
        "none":  "none",
        "card":  "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px 0 rgba(11,61,145,0.10), 0 2px 4px -1px rgba(0,0,0,0.08)",
        "dropdown": "0 4px 16px -2px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.08)",
        "modal": "0 20px 60px -10px rgba(0,0,0,0.25), 0 10px 20px -5px rgba(0,0,0,0.10)",
        "fab":   "0 4px 20px rgba(11,61,145,0.25)",
        "nav":   "0 1px 0 0 rgba(0,0,0,0.06)",
      },

      // -----------------------------------------------------------------------
      // Animation
      // -----------------------------------------------------------------------
      transitionDuration: {
        "fast":   "150ms",
        "normal": "200ms",
        "slow":   "300ms",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "out":    "cubic-bezier(0, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in":      "fade-in 200ms ease-out",
        "slide-up":     "slide-up 250ms ease-out",
        "slide-in-right": "slide-in-right 200ms ease-out",
        "pulse-soft":   "pulse-soft 2s ease-in-out infinite",
      },

      // -----------------------------------------------------------------------
      // Breakpoints — match spec
      // -----------------------------------------------------------------------
      screens: {
        "xs":  "375px",
        "sm":  "640px",
        "md":  "768px",
        "lg":  "1024px",
        "xl":  "1280px",
        "2xl": "1440px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};

export default config;
