"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input, Select, Textarea } from "@/components/ui/forms";
import { Button } from "@/components/ui/Button";
import { createProductAction, updateProductAction, uploadImageAction } from "../../actions";
import type { Product, ProductCategory, ProductStatus, ProductSpec } from "@/types";
import { Upload, X } from "lucide-react";

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    category: (initialData?.category || "battery") as ProductCategory,
    subcategory: initialData?.subcategory || "",
    featuredImage: initialData?.featuredImage || "",
    sku: initialData?.sku || "",
    status: (initialData?.status || "published") as ProductStatus,
    isActive: initialData?.isActive ?? true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(formData.featuredImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: prev.slug === generateSlug(prev.name) || prev.slug === "" ? generateSlug(newName) : prev.slug,
    }));
  };

  const processImageToWebP = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Could not get canvas context"));
          
          ctx.drawImage(img, 0, 0);
          // Convert to WebP with 0.8 quality
          const webpBase64 = canvas.toDataURL("image/webp", 0.8);
          resolve(webpBase64);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let finalImageUrl = formData.featuredImage;

      if (selectedFile) {
        // Convert to WebP client-side
        const webpBase64 = await processImageToWebP(selectedFile);
        
        // Upload via Server Action
        const uploadRes = await uploadImageAction(
          webpBase64, 
          `product-${Date.now()}.webp`
        );
        
        if (!uploadRes.success || !uploadRes.data) {
          throw new Error(uploadRes.error || "Failed to upload image");
        }
        finalImageUrl = uploadRes.data;
      }

      const productPayload = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        shortDescription: formData.shortDescription,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        featuredImage: finalImageUrl || "/images/placeholder.jpg",
        sku: formData.sku,
        status: formData.status,
        isActive: formData.isActive,
      };

      let result;
      if (isEditing && initialData) {
        result = await updateProductAction(initialData.id, productPayload);
      } else {
        result = await createProductAction({
          ...productPayload,
          specs: [],
        });
      }

      if (result.success) {
        router.push("/admin/products");
      } else {
        setError(result.error || `Failed to ${isEditing ? "update" : "create"} product`);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="e.g., Luminous Tubular Battery"
          required
        />
        <Input
          label="Slug"
          value={formData.slug}
          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder="e.g., luminous-tubular-battery"
          hint="Leave empty to auto-generate from name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as ProductCategory }))}
          options={[
            { value: "battery", label: "Battery" },
            { value: "inverter", label: "Inverter" },
            { value: "solar", label: "Solar" },
            { value: "combo", label: "Combo" },
          ]}
          required
        />
        <Input
          label="Subcategory"
          value={formData.subcategory}
          onChange={(e) => setFormData((prev) => ({ ...prev, subcategory: e.target.value }))}
          placeholder="e.g., Tubular"
        />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">Product Image</label>
        <div className="flex items-start gap-4">
          <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {previewImage ? (
              <>
                <Image src={previewImage} alt="Preview" fill className="object-contain p-2" />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setSelectedFile(null);
                    setFormData(prev => ({ ...prev, featuredImage: "" }));
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm text-neutral-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center p-4">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <span className="text-xs text-neutral-500">No image</span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
            <p className="text-xs text-neutral-500">
              Select an image from your computer. It will automatically be converted to WebP format for optimal performance.
            </p>
            
            <div className="pt-2 border-t border-neutral-200">
              <Input
                label="Or provide Image URL"
                value={formData.featuredImage}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, featuredImage: e.target.value }));
                  if (e.target.value) {
                    setPreviewImage(e.target.value);
                    setSelectedFile(null); // Clear selected file if using URL
                  }
                }}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="SKU / Model"
          value={formData.sku}
          onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
          placeholder="e.g., LUM-TB-150"
        />
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as ProductStatus }))}
          options={[
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
          ]}
          required
        />
      </div>

      <Textarea
        label="Short Description"
        value={formData.shortDescription}
        onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
        placeholder="Brief summary of the product..."
        required
      />

      <Textarea
        label="Full Description"
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        placeholder="Detailed product information..."
        required
        className="min-h-[150px]"
      />

      <div className="flex justify-end pt-4 border-t border-neutral-200">
        <Button
          type="button"
          variant="outline"
          className="mr-3"
          onClick={() => router.push("/admin/products")}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} loadingText={isEditing ? "Saving..." : "Creating..."}>
          {isEditing ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
