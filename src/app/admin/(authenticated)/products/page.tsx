import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { adminListProductsPaged } from "@/services/product.service";
import { Badge } from "@/components/ui/index";
import { ProductFiltersClient } from "./ProductFiltersClient";
import { ProductPaginationClient } from "./ProductPaginationClient";
import { DeleteProductButton } from "./DeleteProductButton";
import type { ProductCategory, ProductStatus } from "@/types";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const q = searchParams.q;
  const category = searchParams.category as ProductCategory | undefined;
  const status = searchParams.status as ProductStatus | undefined;
  
  const cursorCreatedAt = searchParams.cursorCreatedAt;
  const cursorId = searchParams.cursorId;
  const dir = (searchParams.dir as "next" | "prev") || "next";

  const cursor = cursorCreatedAt && cursorId ? { createdAt: cursorCreatedAt, id: cursorId } : undefined;

  const filters = {
    search: q,
    category: category,
    status: status,
  };

  const { data } = await adminListProductsPaged(filters, cursor, dir, 10);
  
  const products = data?.products || [];
  const totalCount = data?.totalCount || 0;
  const hasNext = data?.hasNext || false;
  const hasPrev = data?.hasPrev || false;

  const firstCursor = products.length > 0 ? { createdAt: products[0].createdAt, id: products[0].id } : undefined;
  const lastCursor = products.length > 0 ? { createdAt: products[products.length - 1].createdAt, id: products[products.length - 1].id } : undefined;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/products/add" 
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary-700 rounded-md hover:bg-primary-800 transition-colors gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        
        <ProductFiltersClient />

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-neutral-200 bg-white relative overflow-hidden flex-shrink-0">
                          <Image 
                            src={product.featuredImage || "/images/placeholder.jpg"} 
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                            {product.name}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {product.sku || product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-neutral-600">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.status === "published" ? "success" : "neutral"}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-neutral-400 hover:text-primary-700 transition-colors rounded"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-10 w-10 text-neutral-300 mb-3 flex items-center justify-center rounded-full bg-neutral-100">
                        <Search className="h-5 w-5" />
                      </div>
                      <p className="font-medium text-neutral-900">No products found</p>
                      <p className="text-sm mt-1 mb-4">Try adjusting your filters or search query.</p>
                      <Link 
                        href="/admin/products"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
                      >
                        Clear Filters
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {products.length > 0 && (
          <ProductPaginationClient 
            totalCount={totalCount}
            hasNext={hasNext}
            hasPrev={hasPrev}
            firstCursor={firstCursor}
            lastCursor={lastCursor}
            currentCount={products.length}
          />
        )}
      </div>
    </div>
  );
}

