"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, MessageCircle, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/index";
import { useCart } from "@/features/cart/CartContext";
import { getSingleProductWhatsAppUrl, openWhatsApp } from "@/utils/whatsapp";
import { analytics } from "@/lib/analytics";
import { getProductImage } from "@/utils/image";
import type { Product } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  battery: "Battery",
  inverter: "Inverter",
  solar: "Solar",
  combo: "Combo",
};

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const alreadyInCart = isInCart(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      featuredImage: product.featuredImage,
    });
  };

  const handleOrderNow = () => {
    analytics.whatsAppClicked("product_card", product.id);
    openWhatsApp(getSingleProductWhatsAppUrl(product.name));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="card-base group flex flex-col h-full"
      aria-label={product.name}
    >
      {/* Product image */}
      <Link
        href={`/products/${product.category}/${product.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-inset rounded-t-lg"
        tabIndex={0}
        aria-label={`View ${product.name} details`}
      >
        <div className="product-image-container group-hover:bg-neutral-100 transition-colors">
          <Image
            src={getProductImage(product.featuredImage)}
            alt={product.altText ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
          {product.featured && (
            <div className="absolute top-2 left-2">
              <Badge variant="accent">Popular</Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Product info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category */}
        <Badge variant="primary" className="self-start">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </Badge>

        {/* Name */}
        <Link
          href={`/products/${product.category}/${product.slug}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-sm"
        >
          <h3 className="text-card font-semibold text-neutral-800 leading-snug hover:text-primary-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Short description */}
        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 flex-1">
          {product.shortDescription}
        </p>

        {/* Key specs — first 2 */}
        {product.specs.slice(0, 2).length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Key specifications">
            {product.specs.slice(0, 2).map((spec) => (
              <li
                key={spec.label}
                className="text-xs bg-neutral-50 border border-neutral-200 rounded-sm px-2 py-0.5 text-neutral-600"
              >
                <span className="font-medium">{spec.label}:</span> {spec.value}
              </li>
            ))}
          </ul>
        )}

        {/* Price note — no fabricated pricing */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Contact for best price</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-neutral-100">
          <Button
            variant="accent"
            size="sm"
            fullWidth
            leftIcon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
            onClick={handleOrderNow}
            id={`order-whatsapp-${product.id}`}
          >
            Order on WhatsApp
          </Button>
          <Button
            variant={alreadyInCart ? "outline" : "ghost"}
            size="sm"
            fullWidth
            leftIcon={<ShoppingCart className="h-4 w-4" aria-hidden="true" />}
            onClick={handleAddToCart}
            id={`add-to-cart-${product.id}`}
          >
            {alreadyInCart ? "In Cart ✓" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

// ---------------------------------------------------------------------------
// ProductCard skeleton for loading states
// ---------------------------------------------------------------------------
export function ProductCardSkeleton() {
  return (
    <div className="card-base overflow-hidden" aria-hidden="true">
      <div className="aspect-[4/3] bg-neutral-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse" />
        <div className="h-3 w-full bg-neutral-100 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-neutral-100 rounded animate-pulse" />
        <div className="pt-2 space-y-2">
          <div className="h-9 w-full bg-amber-100 rounded animate-pulse" />
          <div className="h-9 w-full bg-neutral-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
