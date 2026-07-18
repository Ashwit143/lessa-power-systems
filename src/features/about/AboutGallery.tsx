"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/Lightbox";

const galleryImages = [
  { src: "/aboutUs/image copy.png", alt: "Inside the store showing products" },
  { src: "/aboutUs/image copy 2.png", alt: "Battery display area" },
  { src: "/aboutUs/image copy 3.png", alt: "Inverter display area" },
  { src: "/aboutUs/image copy 4.png", alt: "Staff assisting customers" },
  { src: "/aboutUs/image copy 5.png", alt: "Customer consulting" },
];

export function AboutGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-[3/4] w-full bg-neutral-100 rounded-xl overflow-hidden group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 block"
              aria-label={`View larger image: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover/btn:scale-105"
                loading={index < 2 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-black/0 group-hover/btn:bg-black/10 transition-colors duration-300" />
            </button>
          ))}
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
