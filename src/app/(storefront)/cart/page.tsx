"use client";

import { useCart } from "@/features/cart/CartContext";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/index";
import { Trash2, ShoppingCart, MessageCircle, Plus, Minus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/forms";
// unused imports removed
import { analytics } from "@/lib/analytics";

export default function CartPage() {
  const { items, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
    toast.success("Cart cleared");
  };

  if (items.length === 0) {
    return (
      <div className="section-padding min-h-screen bg-neutral-50">
        <div className="container-site">
          <h1 className="text-page text-neutral-900 mb-8">Your Cart</h1>
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Browse our products and add items to your cart, then send your order via WhatsApp."
            action={
              <Button variant="primary" size="lg" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding min-h-screen bg-neutral-50">
      <div className="container-site">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-page text-neutral-900">
            Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
          </h1>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-error transition-colors"
            aria-label="Clear all items from cart"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="card-base p-4 flex gap-4"
                aria-label={`Cart item: ${item.name}`}
              >
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 bg-neutral-50 rounded-lg overflow-hidden">
                  <Image
                    src={item.featuredImage}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.category}/${item.slug}`}
                    className="font-semibold text-neutral-800 hover:text-primary-700 transition-colors line-clamp-2 text-sm leading-snug"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-neutral-500 mt-1 capitalize">{item.category}</p>
                  <p className="text-xs text-neutral-400 mt-1">Contact for price</p>
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      removeItem(item.productId);
                      toast.success(`${item.name} removed`);
                    }}
                    className="text-neutral-400 hover:text-error transition-colors p-1"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <div className="flex items-center gap-2 border border-neutral-200 rounded-md">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 text-neutral-600 hover:bg-neutral-50 transition-colors"
                      aria-label={`Decrease quantity of ${item.name}`}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span
                      className="text-sm font-semibold text-neutral-800 min-w-[24px] text-center"
                      aria-label={`Quantity: ${item.quantity}`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 text-neutral-600 hover:bg-neutral-50 transition-colors"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card-base p-6 sticky top-24">
              <h2 className="text-lg font-bold text-neutral-800 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-neutral-600 line-clamp-1 flex-1 mr-2">
                      {item.name} ×{item.quantity}
                    </span>
                    <span className="text-neutral-500 text-xs whitespace-nowrap">Quote on WA</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-100 pt-4 mb-5">
                <div className="flex justify-between text-sm font-semibold text-neutral-700">
                  <span>Total items</span>
                  <span>{itemCount}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-2">
                  Pricing will be shared by our team on WhatsApp.
                </p>
              </div>

              <Button
                variant="whatsapp"
                size="lg"
                fullWidth
                asChild
                id="proceed-to-checkout"
              >
                <Link href="/checkout" className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Order on WhatsApp
                </Link>
              </Button>

              <p className="text-xs text-neutral-400 text-center mt-3">
                You will be able to review your details and send your order via WhatsApp.
                <br />No payment is processed here.
              </p>
            </div>
          </div>
        </div>

        <ConfirmDialog
          open={showClearConfirm}
          title="Clear your cart?"
          description="This will remove all items from your cart. This action cannot be undone."
          confirmText="Yes, clear cart"
          cancelText="Keep items"
          onConfirm={handleClearCart}
          onCancel={() => setShowClearConfirm(false)}
          destructive
        />
      </div>
    </div>
  );
}
