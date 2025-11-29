import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import { Footer } from "@/components/Footer";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/Button";
import { ShareButton } from "./ShareButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  images: string[] | null;
  category: string;
  date: string;
  readTime: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
}

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  category: string;
  date: string;
  readTime: string;
}

async function getBlogPost(slug: string): Promise<{ post: BlogPost; relatedPosts: RelatedPost[]; featuredPosts: RelatedPost[] } | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
      },
    });

    if (!post) {
      return null;
    }

    // Get related posts (same category first, then other articles if needed)
    let relatedPostsData = await prisma.blogPost.findMany({
      where: {
        published: true,
        category: post.category,
        slug: { not: slug },
      },
      take: 3,
      orderBy: { date: "desc" },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        date: true,
        readTime: true,
      },
    });

    // If no related posts in same category, get other recent articles
    if (relatedPostsData.length === 0) {
      relatedPostsData = await prisma.blogPost.findMany({
        where: {
          published: true,
          slug: { not: slug },
        },
        take: 3,
        orderBy: { date: "desc" },
        select: {
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          date: true,
          readTime: true,
        },
      });
    }

    // Get featured posts (excluding current)
    const featuredPostsData = await prisma.blogPost.findMany({
      where: {
        published: true,
        featured: true,
        slug: { not: slug },
      },
      take: 3,
      orderBy: { date: "desc" },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        date: true,
        readTime: true,
      },
    });

    const images = post.images && Array.isArray(post.images) ? post.images : [];

    return {
      post: {
        ...post,
        date: post.date.toISOString(),
        images: images.length > 0 ? images : null,
      },
      relatedPosts: relatedPostsData.map(p => ({
        ...p,
        date: p.date.toISOString(),
      })),
      featuredPosts: featuredPostsData.map(p => ({
        ...p,
        date: p.date.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function generateStaticParams() {
  // This will be populated at build time if needed
  // For now, we'll use dynamic rendering
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogPost(slug);
  
  if (!data) {
    return {
      title: "Article Not Found",
    };
  }

  const { post } = data;
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const keywords = post.seoKeywords ? post.seoKeywords.split(",").map(k => k.trim()) : [];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `https://rootwise.example/blog/${slug}`,
      siteName: "Rootwise",
      authors: ["Rootwise"],
      tags: keywords,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
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
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getBlogPost(slug);

  if (!data) {
    notFound();
  }

  const { post, relatedPosts, featuredPosts } = data;

  // Structured data for article
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage || undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Rootwise",
      url: "https://rootwise.example",
    },
    publisher: {
      "@type": "Organization",
      name: "Rootwise",
      url: "https://rootwise.example",
      logo: {
        "@type": "ImageObject",
        url: "https://rootwise.example/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://rootwise.example/blog/${slug}`,
    },
    keywords: post.seoKeywords || "",
    articleSection: post.category,
    inLanguage: "en-US",
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <article className="min-h-screen">
        {/* Article Header - Full Width */}
        <header className="border-b border-[#174D3A]/10 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Header Content - Left Column (matches article content) */}
              <div className="lg:col-span-8">
                {/* Back Button */}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm text-[#174D3A]/70 hover:text-[#174D3A] transition-colors mb-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Blog</span>
                </Link>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.1] tracking-tight mb-8">
                  {post.title}
                </h1>

                {/* Featured Image - After Headline */}
                {post.featuredImage ? (
                  <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-lg mb-6">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-[#174D3A]/10 to-[#174D3A]/5 flex items-center justify-center">
                    <div className="text-center text-[#174D3A]/20">
                      <div className="text-6xl mb-4">🌿</div>
                      <p className="text-sm">Featured Image</p>
                    </div>
                  </div>
                )}

                {/* Category & Meta - Below Image */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#4A4A4A] mb-6">
                  <span className="px-3 py-1 rounded-full bg-[#174D3A]/10 text-[#174D3A] font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-xl md:text-2xl text-[#4A4A4A] leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              </div>

              {/* Empty Right Column for Spacing */}
              <div className="lg:col-span-4"></div>
            </div>
          </div>
        </header>

        {/* Article Content with Right Sidebar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-8">

              <div className="article-content prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-3xl md:text-4xl font-bold text-[#174D3A] mt-12 mb-6 leading-tight" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-3xl md:text-4xl font-bold text-[#174D3A] mt-12 mb-6 leading-tight" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-2xl md:text-3xl font-bold text-[#174D3A] mt-10 mb-4 leading-tight" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-[#1A1A1A] mb-6 leading-relaxed text-lg" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-6 space-y-2 text-lg text-[#1A1A1A]" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside mb-6 space-y-2 text-lg text-[#1A1A1A]" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-4" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold text-[#174D3A]" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="text-[#174D3A] hover:underline" {...props} />
                    ),
                    img: ({ node, ...props }) => (
                      <div className="my-8 rounded-lg overflow-hidden">
                        <img className="w-full h-auto" {...props} />
                      </div>
                    ),
                  }}
                >
                {post.content}
                </ReactMarkdown>
              </div>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-[#174D3A]/10">
                <ShareButton
                  title={post.title}
                  text={post.excerpt}
                  slug={slug}
                />
              </div>
            </div>

            {/* Right Sidebar - Related Articles */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24">
                <h2 className="text-xl font-semibold text-[#174D3A] mb-6">Related Articles</h2>
                <div className="space-y-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block p-5 rounded-2xl border border-white/40 bg-white/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      {relatedPost.featuredImage && (
                        <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <span className="text-xs font-semibold text-[#174D3A] mb-2 block">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-base font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#174D3A] transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-[#4A4A4A] line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#4A4A4A]">
                        <Calendar className="h-3 w-3" />
                        {new Date(relatedPost.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Featured Articles - Bottom */}
        {featuredPosts.length > 0 && (
          <div className="bg-gradient-to-b from-white to-[#174D3A]/5 py-16 border-t border-[#174D3A]/10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-[#174D3A] mb-8">Featured Articles</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {featuredPosts.map((featured) => (
                  <Link
                    key={featured.slug}
                    href={`/blog/${featured.slug}`}
                    className="group block rounded-2xl border border-[#174D3A]/20 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {featured.featuredImage && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={featured.featuredImage}
                          alt={featured.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-xs font-semibold text-[#174D3A] mb-2 block">
                        {featured.category}
                      </span>
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#174D3A] transition-colors line-clamp-2">
                        {featured.title}
                      </h3>
                      <p className="text-sm text-[#4A4A4A] line-clamp-3 mb-4">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#4A4A4A]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {featured.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View All Articles Button */}
        <div className="bg-white py-12 border-t border-[#174D3A]/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <Link href="/blog">
              <Button size="lg">View All Articles</Button>
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </PageShell>
  );
}
