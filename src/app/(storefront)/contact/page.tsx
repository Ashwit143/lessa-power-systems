import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { ContactForm } from "@/features/contact/ContactForm";

export const metadata: Metadata = {
  title: `Contact Us — ${SITE_CONFIG.businessName}`,
  description: `Get in touch with ${SITE_CONFIG.businessName}. Authorized Luminous distributor in Hyderabad. Call us, chat on WhatsApp, or visit our store in Nizampet.`,
  alternates: { canonical: `${SITE_CONFIG.siteUrl}/contact` },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      {/* Page Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-site py-16">
          <div className="max-w-2xl">
            <span className="section-eyebrow">Get in touch</span>
            <h1 className="text-page text-neutral-900 mt-2 mb-4">Contact Us</h1>
            <p className="text-lg text-neutral-600">
              Have a question about our products or need help choosing the right power solution? 
              Our team is here to help. Contact us via phone, WhatsApp, or drop us a message.
            </p>
          </div>
        </div>
      </div>

      <div className="container-site mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Our Store</h3>
                    <address className="not-italic text-neutral-600 text-sm leading-relaxed">
                      {SITE_CONFIG.address.line1}<br />
                      {SITE_CONFIG.address.line2}<br />
                      {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} {SITE_CONFIG.address.pincode}
                    </address>
                    {SITE_CONFIG.googleMapsUrl && (
                      <a 
                        href={SITE_CONFIG.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Get Directions &rarr;
                      </a>
                    )}
                  </div>
                </div>

                {/* Phones */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Phone & WhatsApp</h3>
                    <div className="space-y-1">
                      {SITE_CONFIG.phones.map((phone) => (
                        <div key={phone}>
                          <a 
                            href={`tel:+91${phone}`}
                            className="text-neutral-600 text-sm hover:text-primary-700 transition-colors"
                          >
                            +91 {phone.replace(/(\d{5})(\d{5})/, "$1 $2")}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                    <a 
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-neutral-600 text-sm hover:text-primary-700 transition-colors"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Business Hours</h3>
                    <ul className="space-y-1 text-sm text-neutral-600">
                      {SITE_CONFIG.businessHours.map((hours, index) => (
                        <li key={index} className="flex justify-between gap-4">
                          <span>{hours.day}</span>
                          <span className={hours.closed ? "text-error font-medium" : ""}>
                            {hours.closed ? "Closed" : `${hours.open} - ${hours.close}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Embedded Map */}
            {SITE_CONFIG.googleMapsEmbedUrl && (
              <div className="rounded-xl overflow-hidden border border-neutral-200 h-64 bg-neutral-200">
                <iframe 
                  src={SITE_CONFIG.googleMapsEmbedUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map showing location of ${SITE_CONFIG.businessName}`}
                ></iframe>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="card-base p-6 md:p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Send us a message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
