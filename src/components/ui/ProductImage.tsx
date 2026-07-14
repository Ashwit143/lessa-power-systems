"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { getProductImage } from "@/utils/image";

interface ProductImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string | null | undefined;
  alt: string;
}

export function ProductImage({ src, alt, ...props }: ProductImageProps) {
  const [error, setError] = useState(false);
  
  const finalSrc = error || !src || src.trim() === '' ? getProductImage(null) : src;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  );
}
