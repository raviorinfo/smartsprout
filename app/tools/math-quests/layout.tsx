import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gamified Math Quests – SmartSprout 🌱",
  description: "Turn math homework into an epic video game! Solve math problems to defeat monsters and unlock treasures.",
  alternates: {
    canonical: "https://smartsprout.com/tools/math-quests",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    "name": "SmartSprout Math Quests",
    "description": "A gamified math learning tool that turns homework into an interactive narrative quest.",
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
