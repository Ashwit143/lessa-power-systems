"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/Lightbox";

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

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <section className="section-padding bg-white border-t border-neutral-200">
      <div className="container-site">
        <div className="max-w-3xl mb-12 text-center mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Store</h2>
          <p className="text-neutral-600">
            Visit our authorized Luminous dealership in Hyderabad to explore our complete range of power solutions in person.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-video md:aspect-square bg-neutral-100 rounded-xl overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              aria-label={`View larger image: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading={index < 2 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
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
