import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { generateAIResponse, extractHealthConditions } from "@/lib/ai-service";
import { prisma } from "@/lib/prisma";

/**
 * Generate AI response and save to chat
 * Also extracts health conditions and updates user profile
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { sessionId, userMessage } = body;

    if (!sessionId || !userMessage) {
      return NextResponse.json(
        { error: "sessionId and userMessage required" },
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

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        userId: user.id,
        role: "USER",
        content: userMessage,
      },
    });

    // Generate AI response
    const aiResponse = await generateAIResponse(userMessage, user.id, sessionId);

    // Save AI response
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        userId: null, // AI messages don't have userId
        role: "ASSISTANT",
        content: aiResponse,
      },
    });

    // Extract health conditions (if any mentioned)
    const extracted = extractHealthConditions(userMessage);
    
    if (extracted && (extracted.conditions.length > 0 || extracted.facts.length > 0)) {
      // Auto-add conditions and facts to user profile
      try {
        const { upsertConditionFromStructuredInput, updateUserMemoryFromFacts } = await import("@/lib/profile-updater");
        
        if (extracted.conditions.length > 0) {
          await upsertConditionFromStructuredInput(user.id, extracted.conditions);
        }
        
        if (extracted.facts.length > 0) {
          await updateUserMemoryFromFacts(user.id, extracted.facts);
        }
      } catch (error) {
        console.error("Failed to auto-update profile:", error);
        // Don't fail the whole request
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      extracted: extracted || null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("AI response error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

