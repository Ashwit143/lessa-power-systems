import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE_CONFIG.businessName}`,
  description: `Privacy policy and data collection practices for ${SITE_CONFIG.businessName}.`,
  alternates: { canonical: `${SITE_CONFIG.siteUrl}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="section-padding bg-white min-h-screen">
      <div className="container-site max-w-3xl">
        <h1 className="text-page text-neutral-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral max-w-none">
          <p className="lead text-lg text-neutral-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>

          <h2 className="text-xl font-bold text-neutral-800 mt-8 mb-4">1. Introduction</h2>
          <p className="text-neutral-600 mb-6">
            Welcome to {SITE_CONFIG.businessName}. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website 
            and tell you about your privacy rights.
          </p>

          <h2 className="text-xl font-bold text-neutral-800 mt-8 mb-4">2. The Data We Collect</h2>
          <p className="text-neutral-600 mb-4">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mb-6 text-neutral-600 space-y-2">
            <li><strong>Identity Data</strong> includes first name, last name, or similar identifier.</li>
            <li><strong>Contact Data</strong> includes phone number, email address, and delivery address.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
          </ul>

          <h2 className="text-xl font-bold text-neutral-800 mt-8 mb-4">3. How We Use Your Data</h2>
          <p className="text-neutral-600 mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-6 text-neutral-600 space-y-2">
            <li>To respond to your inquiries and provide quotes.</li>
            <li>To manage our relationship with you.</li>
            <li>To improve our website, products/services, marketing or customer relationships.</li>
            <li>To communicate with you via WhatsApp or phone regarding your orders or inquiries.</li>
          </ul>

          <h2 className="text-xl font-bold text-neutral-800 mt-8 mb-4">4. Data Security</h2>
          <p className="text-neutral-600 mb-6">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
            used or accessed in an unauthorized way, altered or disclosed. We do not sell or share your personal data 
            with third parties for marketing purposes.
          </p>

          <h2 className="text-xl font-bold text-neutral-800 mt-8 mb-4">5. Contact Us</h2>
          <p className="text-neutral-600 mb-6">
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
            <p className="font-semibold text-neutral-900 mb-1">{SITE_CONFIG.businessName}</p>
            <p className="text-neutral-600 text-sm mb-1">{SITE_CONFIG.email}</p>
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

// Temporary Button component inline since we don't need a heavy import here
function Button({ children, variant, size, asChild, ...props }: any) {
  const Comp = asChild ? "span" : "button";
  return <Comp className="inline-block px-4 py-2 border border-neutral-300 rounded-md text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors" {...props}>{children}</Comp>;
}
