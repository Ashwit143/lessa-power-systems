import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "cat-battery",
    slug: "battery",
    name: "Batteries",
    shortName: "Batteries",
    description:
      "Luminous tubular, flat plate, and solar batteries for home UPS systems. Engineered for Indian power conditions — built for frequent, deep cycling without compromising life.",
    valueProp: "Long-lasting power storage for every home",
    icon: "Battery",
    featuredImage: "/images/categories/batteries.webp",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "cat-inverter",
    slug: "inverter",
    name: "Inverters",
    shortName: "Inverters",
    description:
      "From compact 850VA home UPS units to industrial 5KVA systems — pure sine wave Luminous inverters for homes, shops, offices, and farmhouses in Hyderabad.",
    valueProp: "Pure sine wave power for homes & businesses",
    icon: "Zap",
    featuredImage: "/images/categories/inverters.webp",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "cat-solar",
    slug: "solar",
    name: "Solar",
    shortName: "Solar",
    description:
      "On-grid, off-grid, and hybrid solar systems including Luminous solar inverters, high-efficiency panels, charge controllers, and solar-specific batteries. End-to-end solar solutions for Hyderabad.",
    valueProp: "Reduce your electricity bill with solar",
    icon: "Sun",
    featuredImage: "/images/categories/solar.webp",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "cat-combo",
    slug: "combo",
    name: "Combos",
    shortName: "Combos",
    description:
      "Pre-matched inverter + battery + trolley combos — everything you need for a home UPS installation in one package. Matched by our experts for optimal performance.",
    valueProp: "Complete inverter + battery sets, ready to install",
    icon: "Package",
    featuredImage: "/images/categories/combos.webp",
    isActive: true,
    sortOrder: 4,
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
