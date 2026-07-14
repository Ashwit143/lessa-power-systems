"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/forms";
import { useCart } from "@/features/cart/CartContext";
import { getCartWhatsAppUrl, openWhatsApp, CheckoutData } from "@/utils/whatsapp";
import { MessageCircle } from "lucide-react";
import { analytics } from "@/lib/analytics";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  address: z.string().min(10, "Please provide a complete address"),
});

export function CheckoutForm() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    setIsMounted(true);
    // Load saved details from localStorage
    const saved = localStorage.getItem("leesa_checkout_details");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name) setValue("name", parsed.name);
        if (parsed.mobile) setValue("mobile", parsed.mobile);
        if (parsed.address) setValue("address", parsed.address);
      } catch {
        // ignore JSON parse error
      }
    }
  }, [setValue]);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 mb-4">Your cart is empty.</p>
        <Button variant="primary" onClick={() => router.push("/products")}>
          Browse Products
        </Button>
      </div>
    );
  }

  const onSubmit = (data: CheckoutData) => {
    // Save to local storage for future use
    localStorage.setItem("leesa_checkout_details", JSON.stringify(data));
    
    // Generate URL and open WhatsApp
    const url = getCartWhatsAppUrl(items, data);
    analytics.whatsAppClicked("checkout_form");
    openWhatsApp(url);
    
    // Clear cart and redirect
    clearCart();
    toast.success("Order request prepared for WhatsApp!");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Full Name"
        {...register("name")}
        error={errors.name?.message}
        placeholder="Enter your full name"
        required
        autoComplete="name"
      />
      <Input
        label="Mobile Number"
        type="tel"
        inputMode="numeric"
        {...register("mobile")}
        error={errors.mobile?.message}
        placeholder="10-digit mobile number"
        required
        autoComplete="tel"
      />
      <Textarea
        label="Complete Address"
        {...register("address")}
        error={errors.address?.message}
        placeholder="Flat No, Building, Street, Area, City, Pincode"
        required
        autoComplete="street-address"
        rows={4}
      />
      
      <div className="pt-4 border-t border-neutral-100">
        <Button
          type="submit"
          variant="whatsapp"
          size="xl"
          fullWidth
          leftIcon={<MessageCircle className="h-5 w-5" aria-hidden="true" />}
        >
          Send Order via WhatsApp
        </Button>
        <p className="text-xs text-neutral-400 text-center mt-3">
          This will open WhatsApp with your order and shipping details.
        </p>
      </div>
    </form>
  );
}
