import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single blog post by slug for public display
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get related posts (same category, excluding current)
    const relatedPosts = await prisma.blogPost.findMany({
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

    return NextResponse.json({ post, relatedPosts });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

