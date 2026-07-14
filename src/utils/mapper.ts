export function mapProduct(row: any): any {
  if (!row) return row;
  return {
    ...row,
    shortDescription: row.short_description,
    featuredImage: row.featured_image,
    pdfDatasheet: row.pdf_datasheet,
    priceRange: row.price_range,
    stockStatus: row.stock_status,
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    altText: row.alt_text,
    isDemo: row.is_demo,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    useCases: row.use_cases,
  };
}

export function mapBanner(row: any): any {
  if (!row) return row;
  return {
    ...row,
    ctaText: row.cta_text,
    ctaHref: row.cta_href,
    imageMobile: row.image_mobile,
    overlayOpacity: row.overlay_opacity,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
