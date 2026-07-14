// =============================================================================
// Analytics Abstraction Layer
//
// All analytics event tracking routes through this module. Swap the underlying
// implementation (GA4, Meta Pixel, Mixpanel, Posthog, etc.) here without
// touching any page, feature, or component code.
//
// Currently stubbed — no external analytics loaded until the client confirms
// which platform(s) to use and provides measurement IDs.
//
// Future integration:
//   1. Add measurement IDs to .env.local
//   2. Load the script in app/layout.tsx
//   3. Implement the stubs below with the real tracking calls
// =============================================================================

export type AnalyticsEvent =
  | { name: "page_view"; properties: { url: string; title: string } }
  | { name: "product_viewed"; properties: { productId: string; productName: string; category: string } }
  | { name: "add_to_cart"; properties: { productId: string; productName: string; category: string } }
  | { name: "remove_from_cart"; properties: { productId: string } }
  | { name: "cart_opened" }
  | { name: "whatsapp_cta_clicked"; properties: { source: string; productId?: string } }
  | { name: "solar_lead_submitted"; properties: { billRange?: string } }
  | { name: "contact_form_submitted" }
  | { name: "product_search"; properties: { query: string; resultsCount: number } }
  | { name: "category_viewed"; properties: { category: string } }
  | { name: "filter_applied"; properties: { filterType: string; filterValue: string } };

// ---------------------------------------------------------------------------
// Core analytics interface — implement this when adding a provider
// ---------------------------------------------------------------------------
interface AnalyticsProvider {
  trackPageView(url: string, title: string): void;
  trackEvent(event: AnalyticsEvent): void;
}

// ---------------------------------------------------------------------------
// Stub provider (no-op) — replace with real implementation when ready
// ---------------------------------------------------------------------------
const stubProvider: AnalyticsProvider = {
  trackPageView(_url, _title) {
    // TODO: Implement with GA4/Meta Pixel when measurement IDs are provided
    // Example GA4: gtag('event', 'page_view', { page_location: url, page_title: title })
    // Example Meta: fbq('track', 'PageView')
  },
  trackEvent(_event) {
    // TODO: Implement event tracking
    // Example GA4: gtag('event', event.name, event.properties)
    // Example Meta: fbq('trackCustom', event.name, event.properties)
  },
};

// ---------------------------------------------------------------------------
// Active provider — swap stubProvider for a real implementation here
// ---------------------------------------------------------------------------
const provider: AnalyticsProvider = stubProvider;

// ---------------------------------------------------------------------------
// Public API — used throughout the application
// ---------------------------------------------------------------------------
export const analytics = {
  pageView(url: string, title: string) {
    provider.trackPageView(url, title);
  },

  event(event: AnalyticsEvent) {
    provider.trackEvent(event);
  },

  // Convenience methods for common events
  productViewed(productId: string, productName: string, category: string) {
    analytics.event({ name: "product_viewed", properties: { productId, productName, category } });
  },

  addedToCart(productId: string, productName: string, category: string) {
    analytics.event({ name: "add_to_cart", properties: { productId, productName, category } });
  },

  removedFromCart(productId: string) {
    analytics.event({ name: "remove_from_cart", properties: { productId } });
  },

  whatsAppClicked(source: string, productId?: string) {
    analytics.event({ name: "whatsapp_cta_clicked", properties: { source, productId } });
  },

  solarLeadSubmitted(billRange?: string) {
    analytics.event({ name: "solar_lead_submitted", properties: { billRange } });
  },

  productSearched(query: string, resultsCount: number) {
    analytics.event({ name: "product_search", properties: { query, resultsCount } });
  },
} as const;
