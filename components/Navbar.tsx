"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  BookOpen,
  FileText,
  Palette,
  Lightbulb,
  Menu,
  X,
  Map,
  Swords,
  Paintbrush,
  Music,
  BotMessageSquare,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { href: "/blog", label: "Blog", icon: BookOpen, color: "text-emerald-500" },
  { href: "/about", label: "About", icon: Sprout, color: "text-emerald-500" },
];

const toolLinks = [
  { href: "/tools/tutor", label: "AI Tutor", icon: BotMessageSquare, color: "text-emerald-500", desc: "Safe learning chat", bg: "bg-emerald-50" },
  { href: "/tools/story-generator", label: "Story Maker", icon: BookOpen, color: "text-candy-rose", desc: "AI generated reading", bg: "bg-pink-50" },
  { href: "/tools/adventure-stories", label: "Adventures", icon: Map, color: "text-amber-500", desc: "Interactive stories", bg: "bg-amber-50" },
  { href: "/tools/math-quests", label: "Math Quests", icon: Swords, color: "text-indigo-500", desc: "Gamified homework", bg: "bg-indigo-50" },
  { href: "/tools/magic-art", label: "Magic Art", icon: Paintbrush, color: "text-pink-500", desc: "Scribble to painting", bg: "bg-pink-50" },
  { href: "/tools/bedtime-songs", label: "Bedtime Songs", icon: Music, color: "text-blue-800", desc: "Personalized lullabies", bg: "bg-blue-50" },
  { href: "/tools/worksheet-generator", label: "Worksheets", icon: FileText, color: "text-sky-deep", desc: "Printable practice", bg: "bg-sky-50" },
  { href: "/tools/coloring-pages", label: "Coloring Pages", icon: Palette, color: "text-lavender-deep", desc: "Custom coloring sheets", bg: "bg-purple-50" },
  { href: "/tools/activity-finder", label: "Activities", icon: Lightbulb, color: "text-sunshine-deep", desc: "Screen-free ideas", bg: "bg-yellow-50" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-sprout-950/95 backdrop-blur-xl shadow-lg shadow-sprout-950/20"
        : "bg-sprout-950/90 backdrop-blur-lg"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sprout-400 to-sprout-500 flex items-center justify-center shadow-lg shadow-sprout-500/30 group-hover:shadow-sprout-400/50 group-hover:scale-105 transition-all duration-300">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-heading font-extrabold text-white">
              Kiddleaf
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            
            {/* Tools Dropdown (Hover) */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-heading font-semibold text-sprout-100 hover:text-white hover:bg-white/10 transition-all duration-200">
                <Lightbulb className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                Learning Tools
                <ChevronDown className="w-4 h-4 text-sprout-300 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-screen max-w-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out origin-top scale-95 group-hover:scale-100 before:absolute before:-top-4 before:left-0 before:right-0 before:h-4">
                <div className="bg-white rounded-3xl shadow-2xl shadow-black/15 border border-gray-100 p-5 grid grid-cols-3 gap-2">
                  {toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-sprout-50 transition-all group/item text-center"
                    >
                      <div className={`p-2.5 rounded-xl ${link.bg} group-hover/item:scale-110 transition-transform`}>
                        <link.icon className={`w-5 h-5 ${link.color}`} />
                      </div>
                      <div className="text-xs font-heading font-bold text-gray-700">{link.label}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-heading font-semibold transition-all duration-200 ${
                  pathname === link.href
                    ? "text-white bg-white/15"
                    : "text-sprout-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <link.icon className={`w-4 h-4 ${pathname === link.href ? 'text-sprout-300' : link.color} group-hover:scale-110 transition-transform`} />
                {link.label}
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              href="/tools/story-generator"
              className="ml-2 px-5 py-2 bg-gradient-to-r from-sprout-400 to-sprout-500 hover:from-sprout-300 hover:to-sprout-400 text-white text-sm font-heading font-bold rounded-xl shadow-lg shadow-sprout-500/30 hover:shadow-sprout-400/40 hover:scale-105 transition-all duration-300"
            >
              Start Creating ✨
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-sprout-950/98 backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="px-4 py-5 space-y-2">
            
            {/* Mobile Tools Accordion */}
            <div>
              <button 
                onClick={() => setToolsOpen(!toolsOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sprout-100 hover:text-white hover:bg-white/10 transition-all duration-200 font-heading font-semibold"
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  Learning Tools
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              
              {toolsOpen && (
                <div className="pl-4 pr-4 py-2 grid grid-cols-2 gap-2">
                  {toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sprout-200 hover:text-white hover:bg-white/10 transition-all duration-200 font-heading font-medium text-sm"
                    >
                      <link.icon className={`w-4 h-4 ${link.color}`} />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other Mobile Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sprout-100 hover:text-white hover:bg-white/10 transition-all duration-200 font-heading font-semibold"
              >
                <link.icon className={`w-5 h-5 ${link.color}`} />
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA */}
            <Link
              href="/tools/story-generator"
              className="block text-center mt-4 px-5 py-3 bg-gradient-to-r from-sprout-400 to-sprout-500 text-white font-heading font-bold rounded-2xl shadow-lg"
            >
              Start Creating ✨
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
