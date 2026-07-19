import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { normalizeWhatsAppNumber } from "@/utils/whatsapp";
import type { AppSettings } from "@/services/settings.service";
import { SITE_CONFIG } from "@/lib/config";

interface TopContactBarProps {
  settings?: AppSettings;
}

export function TopContactBar({ settings }: TopContactBarProps) {
  const whatsappNumber = settings?.whatsappNumber || SITE_CONFIG.whatsappNumber;
  const primaryPhone = settings?.primaryPhone || SITE_CONFIG.primaryPhone;

  return (
    <div className="w-full bg-primary-900 text-white border-b border-primary-800">
      <div className="container-site">
        <div className="flex flex-row items-center justify-between h-9 md:h-10 text-[11px] md:text-[12px] font-medium tracking-wide px-2 md:px-8 lg:px-12">
          
          {/* Section 1: WhatsApp */}
          <Link
            href={`https://wa.me/${normalizeWhatsAppNumber(whatsappNumber)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 md:gap-2 h-full hover:text-primary-200 transition-colors focus-visible:outline-none focus-visible:text-primary-200"
            aria-label="Chat with us on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80" aria-hidden="true" />
            <span className="hidden sm:inline opacity-90">WhatsApp:</span>
            <span className="font-semibold text-[12px] md:text-[13px]">+{whatsappNumber}</span>
          </Link>

          {/* Section 2: Queries & Booking */}
          <Link
            href={`tel:+91${primaryPhone}`}
            className="flex items-center gap-1.5 md:gap-2 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
            aria-label="Call us"
          >
            <Phone className="h-[14px] w-[14px] opacity-90" aria-hidden="true" />
            <span className="font-semibold text-[12px] md:text-[13px]">+91 {primaryPhone}</span>
          </Link>

        </div>
      </div>
    </div>
  );
}
