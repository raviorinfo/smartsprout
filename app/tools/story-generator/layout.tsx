import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Story Generator for Kids – SmartSprout 🌱",
  description: "Create personalized bedtime stories for your children using AI. Include their name, age, and favorite themes for a magical reading experience.",
  alternates: {
    canonical: "https://smartsprout.com/tools/story-generator",
  }
};

export default function StoryGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    "name": "SmartSprout Story Generator",
    "description": "AI-powered custom bedtime story generator for kids. Enhances reading skills and imagination.",
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
