import type { MetadataRoute } from "next";

const blogSlugs = [
  "what-is-rootwise-comprehensive-guide",
  "how-rootwise-uses-ai-natural-wellness",
  "understanding-rootwise-safety-first-approach",
  "natural-wellness-vs-traditional-medicine-rootwise-perspective",
  "getting-started-with-rootwise-beginners-guide",
  "rootwise-privacy-data-security-approach",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rootwise.example";

  const blogUrls = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogUrls,
    {
      url: `${baseUrl}/womens-health`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-rootwise-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/our-approach`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/why-trust-rootwise`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}

