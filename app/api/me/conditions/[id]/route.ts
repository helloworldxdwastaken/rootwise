import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const body = await request.json();
    const { name, category, notes, diagnosedAt, isActive } = body;

    // Verify condition belongs to user
    const existing = await prisma.condition.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Condition not found" }, { status: 404 });
    }

    const condition = await prisma.condition.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(notes !== undefined && { notes }),
        ...(diagnosedAt !== undefined && { diagnosedAt: diagnosedAt ? new Date(diagnosedAt) : null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ condition });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Condition update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    // Verify condition belongs to user
    const existing = await prisma.condition.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Condition not found" }, { status: 404 });
    }

    // Soft delete
    const condition = await prisma.condition.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ condition });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Condition delete error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

