// =============================================================================
// Image Helpers
// =============================================================================

/**
 * Returns the provided image URL if valid, otherwise returns a dedicated
 * product placeholder SVG.
 */
export function getProductImage(url: string | undefined | null): string {
  if (!url || url.trim() === '') {
    // A generic sleek placeholder for products without images
    // Displays a minimalist battery/inverter/box-like icon
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f5f5f5'/%3E%3Crect x='150' y='160' width='100' height='100' rx='10' fill='none' stroke='%23d4d4d4' stroke-width='10'/%3E%3Ccircle cx='200' cy='210' r='15' fill='%23d4d4d4'/%3E%3Crect x='180' y='145' width='40' height='15' rx='3' fill='%23d4d4d4'/%3E%3C/svg%3E";
  }
  return url;
}
