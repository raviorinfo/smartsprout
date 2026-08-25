import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Worksheet Generator – Kiddleaf 🌱",
  description: "Create free, printable math, English, Hindi, and GK worksheets instantly with AI. Generate full workbooks and download as PDFs.",
  alternates: {
    canonical: "https://kiddleaf.com/tools/worksheet-generator",
  }
};

export default function WorksheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    "name": "Kiddleaf Worksheet Generator",
    "description": "Generate custom educational worksheets for math, language, and general knowledge.",
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
