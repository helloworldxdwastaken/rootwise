import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/personal/", "/profile"],
      },
    ],
    sitemap: "https://rootwise.example/sitemap.xml",
  };
}

