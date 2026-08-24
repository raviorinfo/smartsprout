import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Adventures – SmartSprout 🌱",
  description: "Play AI-generated 'Choose Your Own Adventure' stories. Make choices and shape the magical narrative!",
  alternates: {
    canonical: "https://smartsprout.com/tools/adventure-stories",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    "name": "SmartSprout Interactive Adventures",
    "description": "An interactive, AI-powered 'Choose Your Own Adventure' story game for children.",
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
