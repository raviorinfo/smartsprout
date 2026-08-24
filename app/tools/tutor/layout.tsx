import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sprout the Tutor – Safe AI Chat for Kids 🌱",
  description: "A safe, COPPA-compliant AI tutor that encourages curiosity by guiding kids to find answers themselves instead of just giving them the solution.",
  alternates: {
    canonical: "https://smartsprout.com/tools/tutor",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Sprout the Tutor",
    "description": "An educational AI chatbot designed safely for children. Sprout uses Socratic questioning to help kids learn how to think, not just what to think.",
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
