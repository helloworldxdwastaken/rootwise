import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const { name, category, notes, diagnosedAt } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Condition name is required" },
        { status: 400 }
      );
    }

    const condition = await prisma.condition.create({
      data: {
        userId: user.id,
        name,
        category: category || "SYMPTOM",
        notes,
        diagnosedAt: diagnosedAt ? new Date(diagnosedAt) : null,
      },
    });

    return NextResponse.json({ condition }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Condition creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    const conditions = await prisma.condition.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ conditions });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Conditions fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

