import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogPostBySlug, blogPosts } from "@/lib/blogData";
import { Calendar, User } from "lucide-react";

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: `${post.title} – Kiddleaf Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://kiddleaf.com/blog/${post.slug}`,
    }
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "datePublished": post.date, // Ideally this should be ISO format, but this is a placeholder
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "description": post.excerpt,
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto">
        <header className="mb-12 text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-sprout-100 text-sprout-700 font-semibold text-sm rounded-lg mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-medium pt-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
          </div>
        </header>

        {/* The prose class requires @tailwindcss/typography plugin, but we will use custom global styles for this content block if we don't have it. Instead we just write raw HTML with specific classes. */}
        <div 
          className="prose prose-lg prose-sprout max-w-none 
            prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-800
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </div>
  );
}
