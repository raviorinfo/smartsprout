import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://kiddleaf.com"),
  title: "Kiddleaf – AI Learning Adventures for Kids 🌱",
  description:
    "Free AI-powered educational tools for kids ages 3-10. Create stories, worksheets, coloring pages, and screen-free activities. COPPA compliant and 100% child-safe.",
  keywords: [
    "kids learning",
    "AI education",
    "worksheets",
    "coloring pages",
    "bedtime stories",
    "activities for kids",
  ],
  openGraph: {
    title: "Kiddleaf – AI Learning Adventures for Kids 🌱",
    description: "Free AI-powered educational tools for kids ages 3-10. Create stories, worksheets, coloring pages, and more.",
    url: "https://kiddleaf.com",
    siteName: "Kiddleaf",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kiddleaf - AI Educational Tools for Kids",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiddleaf – AI Learning Adventures for Kids 🌱",
    description: "Free AI-powered educational tools for kids ages 3-10.",
    images: ["/og-image.png"],
  },
};

import BookCartDrawer from "@/components/BookCartDrawer";
import CookieBanner from "@/components/CookieBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <div className="print:hidden"><Navbar /></div>
        <main className="flex-1">{children}</main>
        <div className="print:hidden"><Footer /></div>
        <div className="print:hidden"><BookCartDrawer /></div>
        <CookieBanner />
      </body>
    </html>
  );
}
