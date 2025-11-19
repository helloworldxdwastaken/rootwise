import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const body = await request.json();
    const { value, importance } = body;

    // Verify memory belongs to user
    const existing = await prisma.userMemory.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    const memory = await prisma.userMemory.update({
      where: { id },
      data: {
        ...(value !== undefined && { value }),
        ...(importance !== undefined && { importance }),
        lastUsedAt: new Date(),
      },
    });

    return NextResponse.json({ memory });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Memory update error:", error);
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

    // Verify memory belongs to user
    const existing = await prisma.userMemory.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    await prisma.userMemory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Memory delete error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

