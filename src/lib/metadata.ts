import type { Metadata } from "next";
import { SITE_CONFIG } from "./config";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title = SITE_CONFIG.businessName,
  description = SITE_CONFIG.tagline,
  image = "/images/og-default.jpg",
  noIndex = false,
}: MetadataProps = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@leesapowersystems",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    metadataBase: new URL(SITE_CONFIG.siteUrl),
  };
}
