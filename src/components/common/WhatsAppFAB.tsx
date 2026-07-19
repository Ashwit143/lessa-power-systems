"use client";

import { MessageCircle } from "lucide-react";

import { SITE_CONFIG } from "@/lib/config";
import { getGeneralEnquiryWhatsAppUrl } from "@/utils/whatsapp";
import type { AppSettings } from "@/services/settings.service";
import { cn } from "@/utils/cn";

interface WhatsAppFABProps {
  settings?: AppSettings;
  className?: string;
}

export function WhatsAppFAB({ settings, className }: WhatsAppFABProps) {
  return (
    <div className={cn("fixed bottom-6 right-6 z-50 group", className)}>
      <div className="relative">
        <a
          href={getGeneralEnquiryWhatsAppUrl(settings)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50 active:scale-95"
          aria-label={`Chat with us on WhatsApp at ${settings?.whatsappNumber || SITE_CONFIG.whatsappNumber}`}
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" />
        </a>
        
        {/* Tooltip (Desktop only) */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 hidden w-max rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block pointer-events-none before:absolute before:top-1/2 before:-right-1.5 before:-translate-y-1/2 before:border-y-[6px] before:border-l-[6px] before:border-y-transparent before:border-l-white">
          Need help? Chat with us!
        </div>
      </div>
    </div>
  );
}
