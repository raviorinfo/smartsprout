import React from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Palette,
  Lightbulb,
  Shield,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";

export const metadata = {
  title: "Parent's Guide – Kiddleaf",
  description: "A guide for parents on how to use Kiddleaf safely with their children.",
};

const tips = [
  {
    icon: Eye,
    title: "Supervise Early Sessions",
    description:
      "While all content is filtered for child safety, we recommend sitting with your child during their first few sessions to familiarize yourself with the tools.",
  },
  {
    icon: MessageCircle,
    title: "Talk About What They Create",
    description:
      "Ask your child about the stories they generate, the worksheets they complete, and the activities they try. It's a great conversation starter!",
  },
  {
    icon: Heart,
    title: "Make It a Routine",
    description:
      "Use the Story Generator for bedtime stories, worksheets for after-school practice, and the Activity Finder for weekend fun!",
  },
  {
    icon: Shield,
    title: "Review AI Content",
    description:
      "AI-generated content goes through safety filters, but we recommend parents review materials before sharing with very young children (ages 3-4).",
  },
];

const tools = [
  {
    title: "Story Generator",
    href: "/tools/story-generator",
    icon: BookOpen,
    color: "text-candy-rose",
    bg: "bg-candy-pink/20",
    description:
      "Creates personalized bedtime stories with your child's name. Features a read-aloud function and PDF mini-book downloads. Great for ages 3-10.",
  },
  {
    title: "Worksheet Generator",
    href: "/tools/worksheet-generator",
    icon: FileText,
    color: "text-sky-deep",
    bg: "bg-sky-light/30",
    description:
      "Generates printable math and English worksheets with answer keys. Perfect for homework practice and homeschooling. Preschool through Grade 5.",
  },
  {
    title: "Coloring Pages",
    href: "/tools/coloring-pages",
    icon: Palette,
    color: "text-lavender-deep",
    bg: "bg-lavender-light/30",
    description:
      "AI-generated coloring page outlines from any description. Kids can request animals, vehicles, superheroes, and more. Instant print or PDF download.",
  },
  {
    title: "Activity Finder",
    href: "/tools/activity-finder",
    icon: Lightbulb,
    color: "text-sunshine-deep",
    bg: "bg-sunshine-light/30",
    description:
      "Suggests screen-free crafts, science experiments, and games based on supplies you have at home. Includes safety warnings and step-by-step instructions.",
  },
];

export default function ParentGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-light/20 via-white to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lavender-light/40 text-lavender-deep text-sm font-heading font-bold mb-4">
            <Heart className="w-4 h-4" />
            For Parents & Guardians
          </div>
          <h1 className="text-4xl font-heading font-black text-gray-900 mb-3">
            Parent&apos;s Guide
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Everything you need to know about using Kiddleaf with your children safely and effectively.
          </p>
        </div>

        {/* Safety Card */}
        <div className="bg-gradient-to-r from-sprout-500 to-sprout-600 rounded-3xl p-8 text-white mb-10 shadow-playful-lg">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <h2 className="font-heading font-bold text-2xl">Our Safety Promise</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="font-heading font-bold mb-1">🔒 COPPA Compliant</p>
              <p className="text-white/80">We follow all children&apos;s online privacy protection regulations.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="font-heading font-bold mb-1">🚫 Zero Data Collection</p>
              <p className="text-white/80">We never collect, store, or share any personal information.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="font-heading font-bold mb-1">🛡️ Content Safety</p>
              <p className="text-white/80">All AI content is filtered through strict child-safety guidelines.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="font-heading font-bold mb-1">💾 Browser-Only Storage</p>
              <p className="text-white/80">Created content is saved locally on your device only.</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mb-10">
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6 text-center">
            💡 Tips for Parents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="card-playful flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-lavender-light flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-5 h-5 text-lavender-deep" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-800 mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-500">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tool Guide */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6 text-center">
            📚 Tool Guide
          </h2>
          <div className="space-y-4">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="card-feature flex items-start gap-4 group">
                <div className={`w-12 h-12 rounded-2xl ${tool.bg} flex items-center justify-center flex-shrink-0`}>
                  <tool.icon className={`w-6 h-6 ${tool.color}`} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-800 group-hover:text-sprout-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
