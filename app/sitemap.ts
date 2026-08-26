import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blogData';

const siteUrl = 'https://kiddleaf.com'; // Production URL

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/tools/worksheet-generator',
    '/tools/coloring-pages',
    '/tools/story-generator',
    '/tools/tutor',
    '/tools/adventure-stories',
    '/tools/math-quests',
    '/tools/magic-art',
    '/tools/bedtime-songs',
    '/tools/activity-finder',
    '/blog',
    '/about',
    '/contact',
    '/parent-guide',
    '/privacy-policy',
    '/terms',
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
