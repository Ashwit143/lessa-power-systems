import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../../ProductForm";
import { adminGetProductById } from "@/services/product.service";

export const metadata = {
  title: "Edit Product | Admin Dashboard",
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { data: product, success, error } = await adminGetProductById(params.id);

  if (!success || !product) {
    if (error) console.error("Error fetching product for edit:", error);
    notFound();
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/admin/products" 
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Edit Product</h1>
        <p className="text-neutral-500 mt-1">Update information for {product.name}</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
