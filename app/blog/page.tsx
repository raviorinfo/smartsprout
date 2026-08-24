import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { blogPosts } from "@/lib/blogData";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Parents Blog & Resources – SmartSprout 🌱",
  description: "Expert tips, guides, and resources on early childhood education, screen-free activities, and parenting.",
  alternates: {
    canonical: "https://smartsprout.com/blog",
  }
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-sprout-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-candy-pink to-candy-rose shadow-glow-pink mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-sprout-800">
            Parents Blog & Resources
          </h1>
          <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
            Helpful articles, tips, and guides to make early childhood learning magical and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="bg-white rounded-3xl p-6 shadow-sm border border-sprout-100 hover:shadow-md hover:border-sprout-300 transition-all group flex flex-col h-full"
            >
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-sprout-600">
                <span className="px-2 py-1 bg-sprout-100 rounded-md">{post.category}</span>
                <div className="flex items-center text-gray-400 gap-1 ml-auto">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </div>
              </div>
              <h2 className="text-xl font-heading font-bold text-gray-800 mb-3 group-hover:text-sprout-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 font-body text-sm leading-relaxed mb-6 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center text-sm font-semibold text-sprout-600 group-hover:gap-2 transition-all">
                Read Article <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
