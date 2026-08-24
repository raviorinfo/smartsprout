import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scribble to Masterpiece – SmartSprout 🌱",
  description: "Turn your child's simple scribbles into beautiful, fully-rendered AI artwork!",
  alternates: {
    canonical: "https://smartsprout.com/tools/magic-art",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SmartSprout Magic Art",
    "description": "An AI image-to-image tool that transforms children's drawings into finished art.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
