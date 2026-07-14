# Leesa Power Systems eCommerce Storefront

This is the official Next.js storefront for Leesa Power Systems, an authorized Luminous distributor in Hyderabad.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database / Auth**: Supabase
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context (Cart)

## Setup & Local Development

### 1. Prerequisites
- Node.js 18+
- npm or pnpm

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in the values:
```bash
cp .env.example .env.local
```

### 3. Installation
```bash
npm install
```

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database & Supabase Integration
This project is designed to run in two modes:
1. **Demo Mode (Static)**: When `NEXT_PUBLIC_SUPABASE_URL` is omitted, the app falls back to static JSON data.
2. **Production Mode (Supabase)**: When configured, the app reads and writes from the Supabase database.

For production, you need to execute the SQL schema in `supabase/schema.sql` on your Supabase project.

## Project Structure
- `/src/app/(storefront)`: Public eCommerce pages.
- `/src/app/admin`: Admin dashboard pages.
- `/src/components`: Reusable UI components.
- `/src/features`: Feature-specific components (cart, products, solar, admin).
- `/src/services`: Data access layer abstracting Supabase vs. Static data.
- `/src/schemas`: Zod schemas for forms and data validation.
- `/src/types`: TypeScript interfaces for the domain models.
- `/src/data`: Static seed data used in Demo Mode.

## Content Management
- **Products**: Managed via the Admin Dashboard or `src/data/products.ts` (Demo Mode).
- **Site Configuration**: Core settings (phone numbers, addresses) are managed in `src/lib/config.ts`.
- **Images**: Product images should be placed in `public/images/products/` in WebP format. Use `scripts/optimize-images.ts` to convert raw images.

## Features Checklist
- [x] Responsive layout with design tokens
- [x] Product listing and details pages
- [x] WhatsApp-first checkout logic
- [x] Static Solar landing page
- [x] Admin dashboard UI
- [x] Supabase service layer abstraction
- [x] Static fallback for development
