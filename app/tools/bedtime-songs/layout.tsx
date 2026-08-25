import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bedtime Song Generator – Kiddleaf 🌱",
  description: "Generate a personalized, rhyming lullaby based on your child's day to help them wind down for sleep.",
  alternates: {
    canonical: "https://kiddleaf.com/tools/bedtime-songs",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kiddleaf Bedtime Songs",
    "description": "An AI tool that generates custom bedtime songs and lullabies for children based on their daily activities.",
    "applicationCategory": "LifestyleApplication",
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
