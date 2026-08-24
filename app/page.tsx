import React from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Palette,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Download,
  Star,
  Map,
  Swords,
  Paintbrush,
  Music,
  BotMessageSquare,
  CheckCircle2,
} from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartSprout – Free AI Learning & Activities for Kids 🌱",
  description: "Discover free, AI-generated educational tools for kids. Create personalized stories, math worksheets, coloring pages, and screen-free activities instantly.",
  alternates: {
    canonical: "https://smartsprout.com",
  }
};

const tools = [
  {
    title: "AI Tutor",
    description: "A safe, Socratic AI chatbot that helps kids find answers themselves through guided questioning.",
    href: "/tools/tutor",
    icon: BotMessageSquare,
    gradient: "from-emerald-400 to-sprout-500",
    glow: "shadow-glow-emerald",
    emoji: "💬",
    tag: "NEW",
    tagColor: "from-emerald-400 to-emerald-600",
  },
  {
    title: "Interactive Adventures",
    description: "Choose-your-own-adventure stories where kids control the narrative by making decisions at each chapter.",
    href: "/tools/adventure-stories",
    icon: Map,
    gradient: "from-amber-400 to-orange-500",
    glow: "shadow-glow-yellow",
    emoji: "🗺️",
    tag: "Interactive",
    tagColor: "from-amber-400 to-orange-500",
  },
  {
    title: "Math Quests",
    description: "Gamified math challenges disguised as epic adventures. Solve problems to defeat villains and unlock treasures!",
    href: "/tools/math-quests",
    icon: Swords,
    gradient: "from-indigo-400 to-violet-500",
    glow: "shadow-glow-blue",
    emoji: "⚔️",
    tag: "Gamified",
    tagColor: "from-indigo-400 to-violet-500",
  },
  {
    title: "Magic Art",
    description: "Draw a simple scribble and watch AI transform it into a stunning, colorful masterpiece painting!",
    href: "/tools/magic-art",
    icon: Paintbrush,
    gradient: "from-pink-400 to-rose-500",
    glow: "shadow-glow-pink",
    emoji: "🎨",
    tag: "Creative",
    tagColor: "from-pink-400 to-rose-500",
  },
  {
    title: "Bedtime Songs",
    description: "Generate personalized lullabies based on your child's day to help them wind down for a peaceful sleep.",
    href: "/tools/bedtime-songs",
    icon: Music,
    gradient: "from-blue-700 to-indigo-900",
    glow: "shadow-glow-blue",
    emoji: "🎶",
    tag: "Soothing",
    tagColor: "from-blue-700 to-indigo-900",
  },
  {
    title: "AI Story Maker",
    description: "Create magical bedtime stories personalized with your child's name, favorite themes, and age-appropriate adventures.",
    href: "/tools/story-generator",
    icon: BookOpen,
    gradient: "from-candy-pink to-candy-rose",
    glow: "shadow-glow-pink",
    emoji: "📚",
    tag: "Most Popular",
    tagColor: "from-candy-pink to-candy-rose",
  },
  {
    title: "Worksheet Generator",
    description: "Generate printable math and English worksheets with instant PDF download. Perfect for homework practice!",
    href: "/tools/worksheet-generator",
    icon: FileText,
    gradient: "from-sky-medium to-ocean-deep",
    glow: "shadow-glow-blue",
    emoji: "📝",
    tag: "Printable PDF",
    tagColor: "from-sky-medium to-ocean-deep",
  },
  {
    title: "Coloring Pages",
    description: "AI-powered coloring page outlines of anything your child can imagine. Cute dragons, space rockets, and more!",
    href: "/tools/coloring-pages",
    icon: Palette,
    gradient: "from-lavender-medium to-lavender-deep",
    glow: "shadow-glow",
    emoji: "🖍️",
    tag: "Creative Fun",
    tagColor: "from-lavender-medium to-lavender-deep",
  },
  {
    title: "Activity Finder",
    description: "Discover screen-free crafts, science experiments, and indoor games using supplies you already have at home.",
    href: "/tools/activity-finder",
    icon: Lightbulb,
    gradient: "from-sunshine-medium to-sunshine-deep",
    glow: "shadow-glow-yellow",
    emoji: "💡",
    tag: "Screen-Free",
    tagColor: "from-sunshine-medium to-sunshine-deep",
  },
];

const steps = [
  {
    step: "1",
    title: "Choose a Tool",
    description: "Pick from our 9 AI-powered learning tools designed for kids ages 3-10.",
    icon: Sparkles,
    color: "from-sprout-400 to-sprout-600",
  },
  {
    step: "2",
    title: "Customize",
    description: "Enter your child's details and preferences to personalize the content.",
    icon: Zap,
    color: "from-sky-medium to-ocean-deep",
  },
  {
    step: "3",
    title: "Create & Download",
    description: "Get instant results with free PDF downloads and printable outputs!",
    icon: Download,
    color: "from-candy-pink to-candy-rose",
  },
];

const trustPoints = [
  { label: "COPPA Compliant", icon: "🔒" },
  { label: "No PII Collected", icon: "🚫" },
  { label: "Kid-Safe Content", icon: "👶" },
  { label: "Browser-Only Storage", icon: "💾" },
  { label: "No Sign-Up Required", icon: "✅" },
  { label: "100% Free", icon: "🆓" },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SmartSprout",
    "url": "https://smartsprout.com",
    "description": "Free AI-powered educational tools for kids. Generate worksheets, coloring pages, and stories.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://smartsprout.com/tools/activity-finder?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-sprout-950 via-sprout-900 to-sprout-800 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sprout-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-candy-rose/5 rounded-full blur-3xl"></div>
        
        {/* Floating decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">🌟</div>
          <div className="absolute top-40 right-20 text-5xl animate-float-delayed opacity-20">🚀</div>
          <div className="absolute bottom-40 left-20 text-4xl animate-float opacity-15">🎨</div>
          <div className="absolute bottom-20 right-10 text-5xl animate-float-delayed opacity-20">📚</div>
          <div className="absolute top-1/3 left-1/4 text-3xl animate-bounce-gentle opacity-15">🦕</div>
          <div className="absolute top-1/4 right-1/3 text-4xl animate-float opacity-15">🌈</div>
          <div className="absolute bottom-1/3 right-1/4 text-3xl animate-bounce-gentle opacity-15">✨</div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sprout-200 text-sm font-heading font-semibold mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-sprout-300" />
            Free AI-Powered Learning Tools for Kids
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black text-white leading-tight mb-6 animate-slide-up">
            Learning Adventures{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sprout-300 via-emerald-300 to-sprout-400">
              Powered by AI
            </span>{" "}
            <span className="inline-block animate-wiggle">🌱</span>
          </h1>

          <p className="text-lg sm:text-xl text-sprout-200 max-w-2xl mx-auto mb-10 animate-slide-up font-body leading-relaxed text-balance">
            Create personalized stories, printable worksheets, coloring pages,
            and screen-free activities — all designed for kids ages 3-10.
            <span className="font-semibold text-white"> 100% free. 100% safe.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link href="/tools/story-generator" className="group flex items-center gap-2 text-lg px-8 py-4 bg-gradient-to-r from-sprout-400 to-sprout-500 hover:from-sprout-300 hover:to-sprout-400 text-white font-heading font-bold rounded-2xl shadow-xl shadow-sprout-500/30 hover:shadow-sprout-400/40 hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5" />
              Start Creating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/parent-guide" className="flex items-center gap-2 text-lg px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-heading font-bold rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
              <Shield className="w-5 h-5" />
              Parent&apos;s Guide
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-sprout-300">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-sprout-400" /> COPPA Safe</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400" /> No Sign-up</span>
            <span className="flex items-center gap-1.5"><Download className="w-4 h-4 text-sky-400" /> Free PDFs</span>
          </div>
        </div>

        {/* Bottom wave transition */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[50px] md:h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6.1,68.32-15.16,97.6-26.11V120H0Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AdSenseBanner slot="hero-bottom" format="horizontal" />
      </div>

      {/* Tools Section */}
      <section className="py-16 sm:py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sprout-100 text-sprout-700 text-sm font-heading font-semibold mb-4">
              <Sparkles className="w-4 h-4" /> 9 Interactive Learning Tools
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-gray-900 mb-4">
              Everything Your Child Needs to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sprout-500 to-emerald-500">Learn & Play</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto font-body">
              Each tool is powered by AI and designed to spark creativity, critical thinking, and a lifelong love of learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-6 hover:border-sprout-200 hover:shadow-xl hover:shadow-sprout-100/50 hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Tag */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading font-bold text-white bg-gradient-to-r ${tool.tagColor}`}>
                    {tool.tag}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="text-lg font-heading font-bold text-gray-800 mb-1.5 group-hover:text-sprout-700 transition-colors">
                      {tool.emoji} {tool.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-body">
                      {tool.description}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1 text-sm font-heading font-semibold text-sprout-600 group-hover:gap-2 transition-all">
                      Try it free <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-heading font-semibold mb-4">
              <Zap className="w-4 h-4" /> Super Simple
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg font-body">Three simple steps to start learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-gray-200/50 mb-6 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                  <step.icon className="w-8 h-8 text-sprout-500" />
                  <span className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${step.color} text-white text-sm font-bold flex items-center justify-center shadow-lg`}>
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm font-body max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 sm:py-20 bg-white w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-sprout-950 to-sprout-900 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            {/* Decorative grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
                <Shield className="w-8 h-8 text-sprout-300" />
              </div>
              <h3 className="text-3xl font-heading font-black text-white mb-4">
                Built for Safety. Designed for Joy.
              </h3>
              <p className="text-sprout-200 max-w-lg mx-auto mb-8 font-body leading-relaxed">
                SmartSprout is designed with child safety as the top priority. We
                follow COPPA guidelines, collect zero personal data, and all content
                is age-appropriate.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {trustPoints.map((point) => (
                  <span key={point.label} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-heading font-semibold text-sprout-100">
                    {point.icon} {point.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AdSenseBanner slot="footer-top" format="horizontal" />
      </div>
    </div>
  );
}
