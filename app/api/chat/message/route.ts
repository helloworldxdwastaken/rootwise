import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { sessionId, role, content } = body;

    if (!sessionId || !role || !content) {
      return NextResponse.json(
        { error: "sessionId, role, and content are required" },
        { status: 400 }
      );
    }

    // Verify session belongs to user
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        userId: role === "USER" ? user.id : null,
        role,
        content,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Message creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

