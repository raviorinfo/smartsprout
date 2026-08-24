import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Coloring Pages Generator – SmartSprout 🌱",
  description: "Generate custom, free coloring pages instantly with AI. Type any prompt and get an interactive digital canvas or printable PDF coloring book.",
  alternates: {
    canonical: "https://smartsprout.com/tools/coloring-pages",
  }
};

export default function ColoringPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    "name": "SmartSprout Coloring Pages",
    "description": "AI-powered custom coloring page generator for kids. Interactive digital coloring and PDF downloads.",
    "applicationCategory": "EducationalApplication",
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
