import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screen-Free Activity Finder – Kiddleaf 🌱",
  description: "Find engaging, educational, and fun screen-free activities for kids. Search by age, time available, and location (indoor/outdoor).",
  alternates: {
    canonical: "https://kiddleaf.com/tools/activity-finder",
  }
};

export default function ActivityFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    "name": "Kiddleaf Activity Finder",
    "description": "Search engine for screen-free, educational activities for children of all ages.",
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
