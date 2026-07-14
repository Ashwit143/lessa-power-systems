import type { Metadata } from "next";
import { CheckoutForm } from "@/features/cart/CheckoutForm";
import { SITE_CONFIG } from "@/lib/config";
import { Breadcrumb } from "@/components/ui/forms";

export const metadata: Metadata = {
  title: `Checkout — ${SITE_CONFIG.businessName}`,
  description: "Complete your order with Leesa Power Systems.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="section-padding min-h-screen bg-neutral-50">
      <div className="container-site max-w-3xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />
        
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 md:p-8 mt-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6 border-b border-neutral-100 pb-4">
            Shipping Details
          </h1>
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}
