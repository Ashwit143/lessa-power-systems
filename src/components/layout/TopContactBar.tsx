import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

export function TopContactBar() {
  return (
    <div className="w-full bg-primary-900 text-white border-b border-primary-800">
      <div className="container-site">
        <div className="flex flex-row items-center justify-between h-9 md:h-10 text-[11px] md:text-[12px] font-medium tracking-wide px-2 md:px-8 lg:px-12">
          
          {/* Section 1: WhatsApp */}
          <Link
            href="https://wa.me/918121515858"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 md:gap-2 h-full hover:text-primary-200 transition-colors focus-visible:outline-none focus-visible:text-primary-200"
            aria-label="Chat with us on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80" aria-hidden="true" />
            <span className="hidden sm:inline opacity-90">WhatsApp:</span>
            <span className="font-semibold text-[12px] md:text-[13px]">+91 8121515858</span>
          </Link>

          {/* Section 2: Queries & Booking */}
          <Link
            href="tel:+919440698412"
            className="flex items-center gap-1.5 md:gap-2 h-full hover:text-primary-200 transition-colors focus-visible:outline-none focus-visible:text-primary-200"
            aria-label="Call for General enquiries and Product booking"
          >
            <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80" aria-hidden="true" />
            <span className="hidden sm:inline opacity-90">Queries & Booking:</span>
            <span className="font-semibold text-[12px] md:text-[13px]">+91 9440698412</span>
          </Link>

        </div>
      </div>
    </div>
  );
}
