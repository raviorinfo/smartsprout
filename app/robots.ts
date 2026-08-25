import { MetadataRoute } from 'next';

const siteUrl = 'https://kiddleaf.com'; // Production URL

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
