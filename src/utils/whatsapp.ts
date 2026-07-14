// =============================================================================
// WhatsApp Utilities
// All WhatsApp message formatting and deep-link generation lives here.
// These are pure functions — easy to unit test without any React imports.
// =============================================================================

import type { CartItem } from "@/types";
import { SITE_CONFIG } from "@/lib/config";

// ---------------------------------------------------------------------------
// URL construction
// ---------------------------------------------------------------------------

/**
 * Builds a wa.me deep link with a URL-encoded pre-filled message.
 * Uses universal https://wa.me/ format (works on Android, iOS, desktop).
 */
export function buildWhatsAppUrl(message: string, number?: string): string {
  const phoneNumber = number ?? SITE_CONFIG.whatsappNumber;
  const encodedMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
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

  let message = [
    "Hi Leesa Power Systems! I'd like to place an order.",
    "",
    "Order Summary:",
    "",
    itemLines,
  ].join("\n");

  if (shippingDetails) {
    message += [
      "",
      "",
      "Shipping Details:",
      "",
      `Name: ${shippingDetails.name}`,
      `Mobile: ${shippingDetails.mobile}`,
      `Address:`,
      shippingDetails.address,
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

export function getCartWhatsAppUrl(items: CartItem[], shippingDetails?: CheckoutData): string {
  return buildWhatsAppUrl(formatCartOrderMessage(items, shippingDetails));
}

export function getSingleProductWhatsAppUrl(
  productName: string,
  quantity?: number
): string {
  return buildWhatsAppUrl(formatSingleProductMessage(productName, quantity));
}

export function getSolarEnquiryWhatsAppUrl(params: {
  name: string;
  phone: string;
  monthlyBillRange?: string;
}): string {
  return buildWhatsAppUrl(formatSolarEnquiryMessage(params));
}

export function getGeneralEnquiryWhatsAppUrl(): string {
  return buildWhatsAppUrl(formatGeneralEnquiryMessage());
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

/**
 * Opens a WhatsApp URL in a new tab with graceful fallback.
 * Call this client-side only.
 */
export function openWhatsApp(url: string): void {
  if (typeof window === "undefined") return;

  const newTab = window.open(url, "_blank", "noopener,noreferrer");

  // Graceful fallback: if popup was blocked, navigate in same tab
  if (!newTab) {
    window.location.href = url;
  }
}
