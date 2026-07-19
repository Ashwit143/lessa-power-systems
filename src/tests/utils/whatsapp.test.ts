import { describe, it, expect } from "vitest";
import {
  buildWhatsAppUrl,
  formatCartOrderMessage,
  formatSingleProductMessage,
  formatSolarEnquiryMessage,
} from "@/utils/whatsapp";
import type { CartItem } from "@/types";

describe("WhatsApp utilities", () => {
  describe("buildWhatsAppUrl", () => {
    it("builds a valid wa.me URL", () => {
      const url = buildWhatsAppUrl("Hello there", "918121515858");
      expect(url).toContain("https://wa.me/918121515858");
      expect(url).toContain("text=");
    });

    it("URL-encodes the message", () => {
      const url = buildWhatsAppUrl("Hello & Goodbye", "918121515858");
      expect(url).toContain(encodeURIComponent("Hello & Goodbye"));
    });
  });

  describe("formatCartOrderMessage", () => {
    it("formats a cart message with single item", () => {
      const items: CartItem[] = [
        {
          productId: "inv-001",
          slug: "luminous-zelio-1100",
          name: "Luminous Zelio+ 1100",
          category: "inverter",
          featuredImage: "/images/test.webp",
          quantity: 1,
        },
      ];
      const msg = formatCartOrderMessage(items);
      expect(msg).toContain("Luminous Zelio+ 1100");
      expect(msg).toContain("Qty: 1");
      expect(msg).toContain("Leesa Power Systems");
    });

    it("formats multiple items with correct numbering", () => {
      const items: CartItem[] = [
        {
          productId: "bat-001",
          slug: "luminous-rc-18000",
          name: "Luminous RC 18000",
          category: "battery",
          featuredImage: "/images/test.webp",
          quantity: 2,
        },
        {
          productId: "inv-001",
          slug: "luminous-zelio-1100",
          name: "Luminous Zelio+ 1100",
          category: "inverter",
          featuredImage: "/images/test.webp",
          quantity: 1,
        },
      ];
      const msg = formatCartOrderMessage(items);
      expect(msg).toContain("1. Luminous RC 18000 — Qty: 2");
      expect(msg).toContain("2. Luminous Zelio+ 1100 — Qty: 1");
    });

    it("returns general enquiry message for empty cart", () => {
      const msg = formatCartOrderMessage([]);
      expect(msg).toBeTruthy();
      expect(msg.length).toBeGreaterThan(0);
    });
  });

  describe("formatSingleProductMessage", () => {
    it("formats a single product message", () => {
      const msg = formatSingleProductMessage("Luminous Zelio+ 1100", 1);
      expect(msg).toContain("Luminous Zelio+ 1100");
      expect(msg).toContain("Qty: 1");
    });

    it("defaults quantity to 1", () => {
      const msg = formatSingleProductMessage("Test Battery");
      expect(msg).toContain("Qty: 1");
    });
  });

  describe("formatSolarEnquiryMessage", () => {
    it("formats a solar enquiry with all fields", () => {
      const msg = formatSolarEnquiryMessage({
        name: "Raj Kumar",
        phone: "9876543210",
        monthlyBillRange: "3000_6000",
      });
      expect(msg).toContain("Raj Kumar");
      expect(msg).toContain("9876543210");
      expect(msg).toContain("₹3,000");
    });

    it("formats without monthly bill range", () => {
      const msg = formatSolarEnquiryMessage({
        name: "Anita",
        phone: "9123456789",
      });
      expect(msg).toContain("Anita");
      expect(msg).toContain("9123456789");
    });
  });
});
