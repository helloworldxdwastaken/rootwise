import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const importance = searchParams.get("importance");

    const memories = await prisma.userMemory.findMany({
      where: {
        userId: user.id,
        ...(importance && { importance: importance as "LOW" | "MEDIUM" | "HIGH" }),
      },
      orderBy: [
        { importance: "desc" },
        { lastUsedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ memories });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Memory fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { key, value, importance } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "key and value are required" },
        { status: 400 }
      );
    }

    // Upsert memory
    const memory = await prisma.userMemory.upsert({
      where: {
        userId_key: {
          userId: user.id,
          key,
        },
      },
      update: {
        value,
        importance: importance || "MEDIUM",
        lastUsedAt: new Date(),
      },
      create: {
        userId: user.id,
        key,
        value,
        importance: importance || "MEDIUM",
        lastUsedAt: new Date(),
      },
    });

    return NextResponse.json({ memory }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Memory creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

