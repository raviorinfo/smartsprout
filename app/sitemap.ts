import { MetadataRoute } from 'next';

const siteUrl = 'https://smartsprout.com'; // Placeholder for production URL

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
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

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
