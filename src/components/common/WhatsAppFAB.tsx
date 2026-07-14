"use client";

import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { getGeneralEnquiryWhatsAppUrl, openWhatsApp } from "@/utils/whatsapp";
import { analytics } from "@/lib/analytics";
import { cn } from "@/utils/cn";

export function WhatsAppFAB({ className }: { className?: string }) {
  const handleClick = () => {
    analytics.whatsAppClicked("fab");
    openWhatsApp(getGeneralEnquiryWhatsAppUrl());
  };

  return (
    <>
      {/* Desktop FAB — bottom-right floating button */}
      <button
        onClick={handleClick}
        className={cn("whatsapp-fab", className)}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span>Chat on WhatsApp</span>
      </button>

      {/* Mobile sticky bottom bar */}
      <div className="whatsapp-sticky-bar md:hidden pb-safe">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 w-full justify-center py-1"
          aria-label="Enquire on WhatsApp"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="font-semibold">Enquire on WhatsApp</span>
        </button>
      </div>
    </>
  );
}
