import Link from "next/link";
import Image from "next/image";
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { adminListAllProducts } from "@/services/product.service";
import { Badge } from "@/components/ui/index";

export default async function AdminProductsPage() {
  const { data: products } = await adminListAllProducts();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/products/new" 
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary-700 rounded-md hover:bg-primary-800 transition-colors gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Filters/Search bar */}
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50/50">
          <div className="relative w-full sm:w-72">
            <input 
              type="search" 
              placeholder="Search products..." 
              className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <select className="border border-neutral-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
              <option value="">All Categories</option>
              <option value="battery">Battery</option>
              <option value="inverter">Inverter</option>
              <option value="solar">Solar</option>
              <option value="combo">Combo</option>
            </select>
            <select className="border border-neutral-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
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
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-neutral-200 bg-white relative overflow-hidden flex-shrink-0">
                          <Image 
                            src={product.featuredImage} 
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
                        <button className="p-1.5 text-neutral-400 hover:text-primary-700 transition-colors rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-neutral-400 hover:text-error transition-colors rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
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
                      <p className="text-sm mt-1">Try adjusting your filters or add a new product.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="text-sm text-neutral-500">
            Showing <span className="font-semibold text-neutral-900">1</span> to <span className="font-semibold text-neutral-900">{products?.length ?? 0}</span> of <span className="font-semibold text-neutral-900">{products?.length ?? 0}</span> products
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-neutral-300 rounded text-sm disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-neutral-300 rounded text-sm disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
