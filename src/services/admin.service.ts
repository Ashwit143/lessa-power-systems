import { listProducts } from "@/services/product.service";
import type { AdminStats } from "@/types";

export async function getAdminStats(): Promise<AdminStats> {
  const { products } = await listProducts({ limit: 1000 } as any, 1, 1000);
  
  return {
    totalProducts: products.length,
    publishedProducts: products.filter(p => p.status === "published").length,
    draftProducts: products.filter(p => p.status === "draft").length,
    totalBanners: 3,
    activeBanners: 2,
    totalLeads: 12,
    newLeads: 3,
    categories: 4
  };
}
