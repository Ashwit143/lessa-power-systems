"use client";

import { useCallback, useEffect, useState } from "react";
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

const DEFAULT_BANNERS: Banner[] = [
  {
    id: "1",
    slug: "power-your-home",
    headline: "Power Your Home",
    subheadline: "Discover Luminous Inverters",
    image: "/banners/hero-1.webp",
    ctaText: "Shop Now",
    ctaHref: "/products/inverter",
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    slug: "reliable-batteries",
    headline: "Reliable Batteries",
    subheadline: "Long-lasting power backup",
    image: "/banners/hero-2.webp",
    ctaText: "Explore",
    ctaHref: "/products",
    isActive: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    slug: "go-solar",
    headline: "Go Solar",
    subheadline: "Sustainable energy solutions",
    image: "/banners/hero-3.webp",
    ctaText: "Learn More",
    ctaHref: "/products/solar",
    isActive: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const displayBanners = DEFAULT_BANNERS;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onInit = useCallback((emblaApi: import("embla-carousel").EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: import("embla-carousel").EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        scrollNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext]);

  if (!displayBanners || displayBanners.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-primary-900 group"
      aria-label="Featured promotions"
    >
      <div ref={emblaRef} className="overflow-hidden touch-pan-y">
        <div className="flex">
          {displayBanners.map((banner, index) => (
            <div
              key={banner.id}
              className="relative flex-shrink-0 w-full h-[180px] min-[390px]:h-[200px] sm:h-[220px] md:h-auto md:aspect-[21/9] lg:aspect-auto lg:h-[500px] xl:h-[550px] cursor-pointer overflow-hidden"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${displayBanners.length}: ${banner.headline}`}
            >
              <Link 
                href={banner.ctaHref}
                className="block absolute inset-0 group/link outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-inset"
                aria-label={`View ${banner.headline}`}
                draggable={false}
              >
                <Image
                  src={banner.image}
                  alt={banner.headline}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/link:scale-105 group-hover/link:brightness-105"
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  quality={85}
                  draggable={false}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {displayBanners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-black/10 hover:bg-black/30 md:bg-white/20 md:hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
          </button>
          <button
            onClick={scrollNext}
            className="flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-black/10 hover:bg-black/30 md:bg-white/20 md:hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
          </button>

          {/* Pagination dots */}
          <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className="group flex items-center justify-center min-w-[32px] min-h-[32px] sm:min-w-[auto] sm:min-h-[auto] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === selectedIndex ? "true" : "false"}
              >
                <span className="sr-only">Slide {index + 1}</span>
                <div className={cn(
                  "w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full transition-all",
                  index === selectedIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 group-hover:bg-white/75"
                )} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
