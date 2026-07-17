"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/Lightbox";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  { src: "/aboutUs/image.png", alt: "Leesa Power Systems Storefront" },
  { src: "/aboutUs/image copy.png", alt: "Inside the store showing products" },
  { src: "/aboutUs/image copy 2.png", alt: "Battery display area" },
  { src: "/aboutUs/image copy 3.png", alt: "Inverter display area" },
  { src: "/aboutUs/image copy 4.png", alt: "Staff assisting customers" },
  { src: "/aboutUs/image copy 5.png", alt: "Customer consulting" },
];

export function AboutGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false, align: "start" }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <section className="section-padding bg-white border-t border-neutral-200">
      <div className="container-site">
        <div className="max-w-3xl mb-12 text-center mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Achievements</h2>
          <p className="text-neutral-600">
            Over {new Date().getFullYear() - 2009}+ years, we&apos;ve grown from a local power backup shop to a trusted Luminous authorized partner — serving thousands of customers, completing hundreds of installations, and building long-term relationships across Hyderabad.
          </p>
        </div>

        <div className="relative group">
          <div className="overflow-hidden touch-pan-y" ref={emblaRef}>
            <div className="flex -ml-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_40%] lg:flex-[0_0_33.333%] min-w-0 pl-4"
                >
                  <button
                    onClick={() => openLightbox(index)}
                    className="relative aspect-[3/4] w-full bg-neutral-100 rounded-xl overflow-hidden group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 block"
                    aria-label={`View larger image: ${image.alt}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover/btn:scale-105"
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/btn:bg-black/10 transition-colors duration-300" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="flex absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 bg-white shadow-lg border border-neutral-100 hover:bg-neutral-50 text-neutral-700 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 opacity-0 group-hover:opacity-100 disabled:opacity-0"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="flex absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 bg-white shadow-lg border border-neutral-100 hover:bg-neutral-50 text-neutral-700 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 opacity-0 group-hover:opacity-100 disabled:opacity-0"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <Lightbox
          images={galleryImages}
          currentIndex={currentIndex}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onNavigate={setCurrentIndex}
        />
      </div>
    </section>
  );
}
