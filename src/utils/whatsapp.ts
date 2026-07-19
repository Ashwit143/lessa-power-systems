// =============================================================================
// WhatsApp Utilities
// All WhatsApp message formatting and deep-link generation lives here.
// These are pure functions — easy to unit test without any React imports.
// =============================================================================

import type { CartItem } from "@/types";
import { SITE_CONFIG } from "@/lib/config";
import type { AppSettings } from "@/services/settings.service";

// ---------------------------------------------------------------------------
// URL construction
// ---------------------------------------------------------------------------

/**
 * Normalizes any phone number format into a valid WhatsApp format (e.g., 918121515858).
 * Strips all non-numeric characters and prepends '91' if it's a 10-digit number.
 */
export function normalizeWhatsAppNumber(phone: string): string {
  let normalized = phone.replace(/\D/g, "");
  
  // If the user provided a 10 digit number, assume India (+91)
  if (normalized.length === 10) {
    normalized = "91" + normalized;
  }
  
  return normalized;
}

/**
 * Builds a wa.me deep link with a URL-encoded pre-filled message.
 * Uses universal https://wa.me/ format (works on Android, iOS, desktop).
 */
export function buildWhatsAppUrl(message: string, number?: string, settings?: AppSettings): string {
  const rawPhoneNumber = number ?? settings?.whatsappNumber ?? SITE_CONFIG.whatsappNumber;
  const phoneNumber = normalizeWhatsAppNumber(rawPhoneNumber);
  const encodedMessage = encodeURIComponent(message.trim());
  
  console.log(`Generated WhatsApp URL: https://wa.me/${phoneNumber}?text=${encodedMessage}`);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function openWhatsApp(url: string): boolean {
  try {
    // Navigate directly in the same tab for best mobile experience
    window.location.href = url;
    return true;
  } catch (error) {
    console.error("Failed to open WhatsApp:", error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Message formatters
// ---------------------------------------------------------------------------

export interface CheckoutData {
  name: string;
  mobile: string;
  address: string;
}

/**
 * Compiles the cart contents into a human-readable order message
 * suitable for WhatsApp.
 */
export function formatCartOrderMessage(items: CartItem[], shippingDetails?: CheckoutData): string {
  if (items.length === 0) {
    return SITE_CONFIG.whatsappMessages.general;
  }

  const itemLines = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} (Qty: ${item.quantity})`
    )
    .join("\n");

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  let message = [
    "Hi Leesa Power Systems! I'd like to place an order.",
    "",
    "Order Summary:",
    "",
    itemLines,
    "",
    `Total Items: ${totalItems}`
  ].join("\n");

  if (shippingDetails) {
    message += "\n\n" + [
      "Shipping Details:",
      "",
      `Name: ${shippingDetails.name}`,
      `Mobile: ${shippingDetails.mobile}`,
      `Address:\n${shippingDetails.address}`,
    ].join("\n");
  }

  return message;
}

/**
 * Builds a single-product quick-order message (skips cart).
 */
export function formatSingleProductMessage(
  productName: string,
  quantity: number = 1
): string {
  return [
    SITE_CONFIG.whatsappMessages.orderPrefix,
    "",
    `1. ${productName} — Qty: ${quantity}`,
    "",
    SITE_CONFIG.whatsappMessages.orderSuffix,
  ].join("\n");
}

/**
 * Builds a solar enquiry message from the lead form inputs.
 */
export function formatSolarEnquiryMessage(params: {
  name: string;
  phone: string;
  monthlyBillRange?: string;
}): string {
  const billLabel = params.monthlyBillRange
    ? `\nMonthly Electricity Bill: ${formatBillRange(params.monthlyBillRange)}`
    : "";

  return `Hi Leesa Power Systems, I'm interested in a solar installation quote.\n\nName: ${params.name}\nPhone: ${params.phone}${billLabel}\n\nPlease contact me at your earliest convenience.`;
}

/**
 * Builds a general enquiry message for the floating WhatsApp button.
 */
export function formatGeneralEnquiryMessage(): string {
  return SITE_CONFIG.whatsappMessages.general;
}

// ---------------------------------------------------------------------------
// Deep link builders — combine message formatter + URL builder
// ---------------------------------------------------------------------------

export function getCartWhatsAppUrl(items: CartItem[], shippingDetails?: CheckoutData, settings?: AppSettings): string {
  return buildWhatsAppUrl(formatCartOrderMessage(items, shippingDetails), undefined, settings);
}

export function getSingleProductWhatsAppUrl(
  productName: string,
  quantity?: number,
  settings?: AppSettings
): string {
  return buildWhatsAppUrl(formatSingleProductMessage(productName, quantity), undefined, settings);
}

export function getSolarEnquiryWhatsAppUrl(params: {
  name: string;
  phone: string;
  monthlyBillRange?: string;
}, settings?: AppSettings): string {
  return buildWhatsAppUrl(formatSolarEnquiryMessage(params), undefined, settings);
}

export function getGeneralEnquiryWhatsAppUrl(settings?: AppSettings): string {
  return buildWhatsAppUrl(formatGeneralEnquiryMessage(), undefined, settings);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBillRange(range: string): string {
  const labels: Record<string, string> = {
    below_1000: "Below ₹1,000/month",
    "1000_3000": "₹1,000 – ₹3,000/month",
    "3000_6000": "₹3,000 – ₹6,000/month",
    "6000_10000": "₹6,000 – ₹10,000/month",
    above_10000: "Above ₹10,000/month",
  };
  return labels[range] ?? range;
}
