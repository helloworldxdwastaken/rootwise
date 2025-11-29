import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all published blog posts for public display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");

    const where: any = {
      published: true,
    };

    if (featured === "true") {
      where.featured = true;
    }

    if (category) {
      where.category = category;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { date: "desc" },
      take: limit ? parseInt(limit) : undefined,
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

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

