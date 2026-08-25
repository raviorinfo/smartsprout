import React from "react";
import { Sprout, Heart, Shield, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us – Kiddleaf 🌱",
  description: "Learn about Kiddleaf's mission to provide free, safe, and magical AI educational tools for children.",
  alternates: {
    canonical: "https://kiddleaf.com/about",
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sprout-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sprout-400 to-sprout-600 shadow-glow mb-4">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-sprout-800">
            About Kiddleaf
          </h1>
          <p className="text-xl text-gray-600 font-body">
            Nurturing young minds with the magic of AI.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-sprout-100 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-sprout-700 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-candy-blue" />
              Our Mission
            </h2>
            <p className="text-gray-600 font-body leading-relaxed">
              At Kiddleaf, we believe that learning should be a magical adventure. 
              Our mission is to provide parents and educators with free, high-quality, 
              and endlessly customizable educational tools. By harnessing the power of 
              artificial intelligence, we create unique learning experiences that adapt 
              to your child's imagination.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-sprout-700 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-500" />
              Safety First
            </h2>
            <p className="text-gray-600 font-body leading-relaxed">
              As parents ourselves, we know that digital safety is non-negotiable. 
              Kiddleaf is built from the ground up to be 100% COPPA compliant. 
              We do not collect personally identifiable information (PII) from children, 
              we do not use behavioral tracking, and all generated content is heavily 
              filtered to ensure it is always age-appropriate and family-friendly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-sprout-700 flex items-center gap-2">
              <Heart className="w-6 h-6 text-candy-rose" />
              Built for Little Learners
            </h2>
            <p className="text-gray-600 font-body leading-relaxed">
              Whether it's a personalized bedtime story about a space-exploring dinosaur, 
              or a custom math worksheet to practice addition, our tools are designed to 
              spark joy. We focus on active, screen-free learning where possible—encouraging 
              kids to print, color, and read in the real world.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
