import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Terms of Service — ${SITE_CONFIG.businessName}`,
  description: `Terms and conditions for ${SITE_CONFIG.businessName}.`,
  alternates: { canonical: `${SITE_CONFIG.siteUrl}/terms` },
};

export default function TermsPage() {
  return (
    <div className="section-padding bg-white min-h-screen">
      <div className="container-site max-w-3xl">
        <h1 className="text-page text-neutral-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-neutral max-w-none">
          <p className="lead text-lg text-neutral-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>

          <h2 className="text-xl font-bold text-neutral-800 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-neutral-600 mb-6">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
            In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>

          <h2 className="text-xl font-bold text-neutral-800 mt-8 mb-4">2. Products and Pricing</h2>
          <p className="text-neutral-600 mb-4">
            We are an authorized distributor of Luminous products. Please note:
          </p>
          <ul className="list-disc pl-6 mb-6 text-neutral-600 space-y-2">
            <li>Product images are for illustrative purposes only. Actual products may vary slightly.</li>
            <li>Prices shared via WhatsApp are subject to change and are valid only for the duration specified in the quotation.</li>
            <li>All technical specifications are provided by the manufacturer and are subject to change without notice.</li>
          </ul>

          <h2 className="text-xl font-bold text-neutral-800 mt-8 mb-4">3. Ordering Process</h2>
          <p className="text-neutral-600 mb-6">
            Our website functions as a product catalog. Orders are not processed or paid for on this website. 
            Clicking "Send Order via WhatsApp" or similar buttons simply opens a chat with our sales team. 
            A contract of sale is only formed once our team confirms your order and payment terms via WhatsApp or in person.
          </p>

          <h2 className="text-xl font-bold text-neutral-800 mt-8 mb-4">4. Warranty and Support</h2>
          <p className="text-neutral-600 mb-6">
            All products sold by {SITE_CONFIG.businessName} carry the standard manufacturer's warranty. 
            Warranty claims and service requests are subject to the terms and conditions set forth by Luminous Power Technologies. 
            We facilitate warranty support for our customers, but the ultimate responsibility for product performance lies with the manufacturer.
          </p>

          <h2 className="text-xl font-bold text-neutral-800 mt-8 mb-4">5. Contact</h2>
          <p className="text-neutral-600 mb-6">
            If you have any questions about these Terms, please contact us.
          </p>
          <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
            <p className="font-semibold text-neutral-900 mb-1">{SITE_CONFIG.businessName}</p>
            <p className="text-neutral-600 text-sm mb-4">+91 {SITE_CONFIG.primaryPhone}</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Contact Page</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Temporary Button component inline
function Button({ children, variant, size, asChild, ...props }: any) {
  const Comp = asChild ? "span" : "button";
  return <Comp className="inline-block px-4 py-2 border border-neutral-300 rounded-md text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors" {...props}>{children}</Comp>;
}
