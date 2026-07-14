"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) {
  const handlePrev = useCallback(() => {
    onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch swipe support
  let touchStartX = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) handleNext();
    if (touchStartX - touchEndX < -50) handlePrev();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery fullscreen view"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Close gallery"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" aria-hidden="true" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" aria-hidden="true" />
          </button>
        </>
      )}

      <div 
        className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="relative w-full max-w-5xl h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
            quality={90}
          />
        </div>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
