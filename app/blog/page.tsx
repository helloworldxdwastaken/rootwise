import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import { SectionContainer } from "@/components/SectionContainer";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { PrismaClient } from "@prisma/client";

export const metadata: Metadata = {
  title: "Rootwise Blog | Natural Wellness Guides, AI Health Support & Evidence-Informed Articles",
  description: "Explore comprehensive guides, insights, and articles about natural wellness, AI-powered health support, Rootwise platform features, safety-first wellness approaches, and evidence-informed care. Learn about holistic health, natural remedies, and complementary medicine.",
  keywords: [
    "wellness blog",
    "natural health articles",
    "AI wellness guide",
    "holistic health",
    "wellness insights",
    "health education",
    "natural wellness",
    "complementary medicine",
    "evidence-based wellness",
    "AI health platform",
    "wellness technology",
    "natural remedies",
    "herbal medicine",
    "nutrition guidance",
    "wellness support",
  ],
  openGraph: {
    title: "Rootwise Blog | Natural Wellness Guides & AI Health Support",
    description: "Comprehensive guides and articles about natural wellness, AI-powered health support, and evidence-informed approaches to wellbeing.",
    type: "website",
    url: "https://rootwise.example/blog",
  },
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        date: true,
        readTime: true,
        featured: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
      },
    });
    return posts.map(post => ({
      ...post,
      date: post.date.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const allPosts = await getBlogPosts();
  const featuredPosts = allPosts.filter((post) => post.featured);
  const regularPosts = allPosts.filter((post) => !post.featured);

  // Structured data for blog listing
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Rootwise Blog",
    description: "Comprehensive guides and articles about natural wellness, AI-powered health support, and evidence-informed approaches to wellbeing",
    url: "https://rootwise.example/blog",
    publisher: {
      "@type": "Organization",
      name: "Rootwise",
      url: "https://rootwise.example",
    },
    blogPost: allPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: `https://rootwise.example/blog/${post.slug}`,
      author: {
        "@type": "Organization",
        name: "Rootwise",
      },
    })),
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <SectionContainer className="gap-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#174D3A]">Insights & Guides</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#174D3A]">Rootwise Blog</h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            Explore comprehensive guides, insights, and articles about natural wellness, AI-powered health support, and evidence-informed approaches to wellbeing.
          </p>
        </header>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#174D3A]">Featured Articles</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-3xl border border-white/40 bg-white/80 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {post.featuredImage && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[#174D3A] mb-3">
                      <span className="font-semibold">{post.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#174D3A] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#4A4A4A] mb-4 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#4A4A4A] flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-sm font-medium text-[#174D3A] flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#174D3A]">All Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-3xl border border-white/40 bg-white/80 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {post.featuredImage && (
                  <div className="relative w-full h-40 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-[#174D3A] mb-3">
                    <span className="font-semibold">{post.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#174D3A] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#4A4A4A] mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#4A4A4A] flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-sm font-medium text-[#174D3A] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {allPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#4A4A4A]">No articles available yet. Check back soon!</p>
            </div>
          )}
        </section>
      </SectionContainer>
    </PageShell>
  );
}

