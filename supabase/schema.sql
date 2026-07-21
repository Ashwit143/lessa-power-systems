-- =============================================================================
-- Leesa Power Systems — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- Categories table
-- =============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  short_name      TEXT NOT NULL,
  description     TEXT NOT NULL,
  value_prop      TEXT NOT NULL,
  icon            TEXT NOT NULL,
  featured_image  TEXT NOT NULL,
  product_count   INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Products table
-- =============================================================================
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('battery', 'inverter', 'solar', 'combo')),
  subcategory     TEXT,
  tags            JSONB DEFAULT '[]',
  featured_image  TEXT NOT NULL,
  gallery         JSONB DEFAULT '[]',
  features        JSONB DEFAULT '[]',
  specs           JSONB NOT NULL DEFAULT '[]',
  use_cases       JSONB DEFAULT '[]',
  pdf_datasheet   TEXT,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured        BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  sku             TEXT,
  price_range     TEXT,
  stock_status    TEXT CHECK (stock_status IN ('in_stock', 'out_of_stock', 'on_request')),
  seo_title       TEXT,
  meta_description TEXT,
  alt_text        TEXT,
  is_demo         BOOLEAN DEFAULT FALSE,
  is_best_seller  BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- =============================================================================
-- Banners table
-- =============================================================================
CREATE TABLE IF NOT EXISTS banners (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  headline        TEXT NOT NULL,
  subheadline     TEXT,
  cta_text        TEXT NOT NULL,
  cta_href        TEXT NOT NULL,
  image           TEXT NOT NULL,
  image_mobile    TEXT,
  overlay_opacity INTEGER DEFAULT 45 CHECK (overlay_opacity BETWEEN 0 AND 100),
  is_active       BOOLEAN DEFAULT TRUE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Leads table (solar enquiries)
-- =============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  phone               TEXT NOT NULL,
  monthly_bill_range  TEXT CHECK (monthly_bill_range IN ('below_1000', '1000_3000', '3000_6000', '6000_10000', 'above_10000')),
  message             TEXT,
  source              TEXT NOT NULL CHECK (source IN ('solar_page', 'contact_form', 'whatsapp_cta')),
  status              TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  ip_address          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- =============================================================================
-- Row Level Security (RLS)
-- =============================================================================

-- Products: anyone can read published + active products; only authenticated can write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  USING (is_active = TRUE AND status = 'published');

CREATE POLICY "Authenticated can manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Categories: anyone can read active categories; only authenticated can write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Authenticated can manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Banners: anyone can read active banners; only authenticated can write
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active banners"
  ON banners FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Authenticated can manage banners"
  ON banners FOR ALL
  USING (auth.role() = 'authenticated');

-- Leads: only authenticated (admin) can read; anyone can insert
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated can view and manage leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================================================
-- Storage Buckets
-- (Create via Supabase Dashboard → Storage OR via API)
-- =============================================================================
-- Bucket: product-images (public)
-- Bucket: banner-images (public)
-- Allowed types: image/webp, image/jpeg, image/png
-- Max file size: 5MB

-- =============================================================================
-- Updated_at trigger
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
