"use client";

import Image from "next/image";
import { ShoppingCart, MessageCircle, Download, Share2, Tag } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/features/cart/CartContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/index";
import { analytics } from "@/lib/analytics";
import { getProductImage } from "@/utils/image";
import type { Product } from "@/types";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      featuredImage: product.featuredImage,
    });
  };


  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch {
        // User cancelled share — no-op
      }
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Image gallery */}
      <div className="space-y-4">
        <div className="aspect-square bg-white rounded-2xl border border-neutral-100 overflow-hidden relative">
          <ProductImage
            src={product.featuredImage}
            alt={product.altText ?? product.name}
            fill
            className="object-contain p-8"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        {product.gallery && product.gallery.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.gallery.map((img, i) => (
              <div key={i} className="relative aspect-square bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100">
                <Image
                  src={getProductImage(img)}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 25vw, 120px"
                  className="object-contain p-2"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col gap-5">
        {/* Category */}
        <div className="flex items-center gap-2">
          <Badge variant="primary">{product.category}</Badge>
          {product.featured && <Badge variant="accent">Popular Choice</Badge>}
        </div>

        {/* Name */}
        <h1 className="text-page text-neutral-900">{product.name}</h1>

        {/* Short description */}
        <p className="text-neutral-600 leading-relaxed">{product.shortDescription}</p>

        {/* Price */}
        {product.price ? (
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-neutral-900">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(product.price)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-neutral-500 bg-neutral-50 rounded-lg px-4 py-3">
            <Tag className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>
              Contact us on WhatsApp for the best price and current availability.
            </span>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">

          <Button
            variant={inCart ? "outline" : "primary"}
            size="lg"
            fullWidth
            leftIcon={<ShoppingCart className="h-5 w-5" aria-hidden="true" />}
            onClick={handleAddToCart}
            id={`add-to-cart-${product.id}`}
          >
            {inCart ? "Added to Cart ✓" : "Add to Cart"}
          </Button>
        </div>

        {/* Utility actions */}
        <div className="flex items-center gap-3 pt-1">
          {product.pdfDatasheet && (
            <a
              href={product.pdfDatasheet}
              download
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-700 transition-colors"
              aria-label="Download product datasheet PDF"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Datasheet
            </a>
          )}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-700 transition-colors"
            aria-label="Share this product"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share
          </button>
        </div>

        {/* Specs table */}
        {product.specs.length > 0 && (
          <div className="mt-2">
            <h2 className="text-lg font-bold text-neutral-800 mb-3">
              Technical Specifications
            </h2>
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm" aria-label="Product specifications">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr
                      key={spec.label}
                      className={i % 2 === 0 ? "bg-neutral-50" : "bg-white"}
                    >
                      <th
                        scope="row"
                        className="py-3 px-4 text-left font-semibold text-neutral-700 w-1/2"
                      >
                        {spec.label}
                      </th>
                      <td className="py-3 px-4 text-neutral-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Use cases */}
        {product.useCases && product.useCases.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-neutral-800 mb-3">Ideal For</h2>
            <ul className="space-y-1.5">
              {product.useCases.map((uc) => (
                <li key={uc} className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" aria-hidden="true" />
                  {uc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
