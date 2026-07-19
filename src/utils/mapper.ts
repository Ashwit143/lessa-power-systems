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

export function mapProductToDb(product: any): any {
  if (!product) return product;
  
  // Clone the object so we don't mutate the original
  const dbRow = { ...product };
  
  // Map camelCase to snake_case
  if ('shortDescription' in product) { dbRow.short_description = product.shortDescription; delete dbRow.shortDescription; }
  if ('featuredImage' in product) { dbRow.featured_image = product.featuredImage; delete dbRow.featuredImage; }
  if ('pdfDatasheet' in product) { dbRow.pdf_datasheet = product.pdfDatasheet; delete dbRow.pdfDatasheet; }
  if ('priceRange' in product) { dbRow.price_range = product.priceRange; delete dbRow.priceRange; }
  if ('stockStatus' in product) { dbRow.stock_status = product.stockStatus; delete dbRow.stockStatus; }
  if ('seoTitle' in product) { dbRow.seo_title = product.seoTitle; delete dbRow.seoTitle; }
  if ('metaDescription' in product) { dbRow.meta_description = product.metaDescription; delete dbRow.metaDescription; }
  if ('altText' in product) { dbRow.alt_text = product.altText; delete dbRow.altText; }
  if ('isDemo' in product) { dbRow.is_demo = product.isDemo; delete dbRow.isDemo; }
  if ('isActive' in product) { dbRow.is_active = product.isActive; delete dbRow.isActive; }
  if ('createdAt' in product) { dbRow.created_at = product.createdAt; delete dbRow.createdAt; }
  if ('updatedAt' in product) { dbRow.updated_at = product.updatedAt; delete dbRow.updatedAt; }
  if ('useCases' in product) { dbRow.use_cases = product.useCases; delete dbRow.useCases; }

  return dbRow;
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
