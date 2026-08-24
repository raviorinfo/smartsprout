import React from "react";
import Link from "next/link";
import { Sprout, Heart, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-sprout-950 text-sprout-50 mt-32">
      {/* Decorative SVG Wave transitioning from white page to dark footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[99%]">
        <svg
          className="relative block w-full h-[50px] md:h-[80px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,137.47,117.8,206.5,102.73Z"
            className="fill-sprout-950"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sprout-400 to-sprout-500 flex items-center justify-center shadow-glow-emerald">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-extrabold text-white">
                SmartSprout
              </span>
            </div>
            <p className="text-sm text-sprout-200 font-body leading-relaxed">
              AI-powered learning adventures for curious kids. Free educational
              tools that spark creativity and imagination. 🌱
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-heading font-bold text-lg text-white">Learning Tools</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm text-sprout-200">
              <li><Link href="/tools/tutor" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">💬 AI Tutor</Link></li>
              <li><Link href="/tools/adventure-stories" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">🗺️ Interactive Adventures</Link></li>
              <li><Link href="/tools/math-quests" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">⚔️ Math Quests</Link></li>
              <li><Link href="/tools/magic-art" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">🎨 Magic Art</Link></li>
              <li><Link href="/tools/bedtime-songs" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">🎶 Bedtime Songs</Link></li>
              <li><Link href="/tools/story-generator" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">📚 Story Generator</Link></li>
              <li><Link href="/tools/worksheet-generator" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">📝 Worksheet Generator</Link></li>
              <li><Link href="/tools/coloring-pages" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">🎨 Coloring Pages</Link></li>
              <li><Link href="/tools/activity-finder" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">💡 Activity Finder</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">For Parents</h3>
            <ul className="space-y-3 text-sm text-sprout-200">
              <li><Link href="/blog" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">📰 Parents Blog</Link></li>
              <li><Link href="/about" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">👋 About Us</Link></li>
              <li><Link href="/contact" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">✉️ Contact Us</Link></li>
              <li><Link href="/parent-guide" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">👨‍👩‍👧 Parent&apos;s Guide</Link></li>
              <li><Link href="/privacy-policy" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">🔒 Privacy Policy</Link></li>
              <li><Link href="/terms" className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">📋 Terms of Service</Link></li>
            </ul>
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-sprout-900/50 rounded-lg border border-sprout-800 text-xs text-sprout-400 font-semibold mt-4">
              <Shield className="w-4 h-4 text-emerald-400" />
              COPPA Compliant • Kid-Safe
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-sprout-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sprout-400 font-body">
            Powered By Arvaan Core Logic and Copyright 2026. Made with{" "}
            <Heart className="w-3 h-3 inline text-pink-500 fill-pink-500" /> for little learners.
          </p>
          <p className="text-xs text-sprout-400 font-body">
            No personal data collected. 100% child-safe.
          </p>
        </div>
      </div>
    </footer>
  );
}
