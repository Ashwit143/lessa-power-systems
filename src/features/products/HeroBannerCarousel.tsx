"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import type { Banner } from "@/types";

interface HeroBannerCarouselProps {
  banners: Banner[];
}

export function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: true }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (banners.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-primary-900"
      aria-label="Featured promotions"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="relative flex-shrink-0 w-full min-h-[420px] sm:min-h-[520px] lg:min-h-[600px]"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${banners.length}: ${banner.headline}`}
            >
              {/* Background image */}
              <Image
                src={banner.image}
                alt={banner.headline}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
                quality={85}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 gradient-primary"
                style={{ opacity: (banner.overlayOpacity ?? 45) / 100 }}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container-site">
                  <div className="max-w-xl">
                    <p className="section-eyebrow mb-3">
                      Authorized Luminous Distributor
                    </p>
                    <h1 className="text-white text-hero mb-4 text-balance">
                      {banner.headline}
                    </h1>
                    {banner.subheadline && (
                      <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed">
                        {banner.subheadline}
                      </p>
                    )}
                    <div>
                      <Button
                        variant="accent"
                        size="xl"
                        asChild
                      >
                        <Link href={banner.ctaHref}>
                          {banner.ctaText}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows — desktop only */}
      {banners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      )}
    </section>
  );
}
