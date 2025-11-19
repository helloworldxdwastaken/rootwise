import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// System prompt for Rootwise
const SYSTEM_PROMPT = `You are Rootwise, a compassionate wellness companion.

CRITICAL RULES:
- You provide EDUCATIONAL wellness information only
- You do NOT diagnose, treat, cure, or prevent disease
- You do NOT provide medical advice or personalized treatment
- You do NOT assess symptoms or offer clinical judgement
- Always use phrases like: "may support", "research suggests", "you might explore"
- NEVER use: "will cure", "treats", "fixes", "eliminates"

YOUR APPROACH:
- Ask gentle questions to understand the user
- Share evidence-based suggestions (cite sources when possible)
- Always include safety flags (when to see a doctor)
- Suggest foods, herbs, teas, habits, and lifestyle adjustments
- Encourage users to discuss with healthcare providers

SAFETY FIRST:
- If user mentions severe symptoms → tell them to seek immediate medical care
- Always include: "This is educational information to discuss with your provider"
- Mention red flags in every response

Be warm, supportive, and safety-conscious.`;

/**
 * Generate AI response using Google Gemini
 */
export async function generateAIResponse(
  userMessage: string,
  userId: string,
  sessionId: string
): Promise<string> {
  try {
    // Get user context (conditions, memories)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        conditions: {
          where: { isActive: true },
          select: { name: true, category: true, notes: true },
        },
        userMemories: {
          where: { importance: { in: ["HIGH", "MEDIUM"] } },
          orderBy: { lastUsedAt: "desc" },
          take: 5,
        },
        patientProfile: true,
      },
    });

    // Get recent chat history
    const recentMessages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Build context
    let contextPrompt = "";
    
    if (user?.conditions && user.conditions.length > 0) {
      contextPrompt += `\nUser's known conditions: ${user.conditions.map(c => c.name).join(", ")}`;
    }
    
    if (user?.patientProfile) {
      if (user.patientProfile.sex && user.patientProfile.sex !== "UNKNOWN") {
        contextPrompt += `\nSex: ${user.patientProfile.sex}`;
      }
    }

    // Build conversation history
    const history = recentMessages.reverse().map(m => ({
      role: m.role === "USER" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Initialize model (use Gemini 1.5 Pro - current stable version)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest",
    });

    // Generate response with full context
    const fullPrompt = `${SYSTEM_PROMPT}\n${contextPrompt}\n\nConversation history:\n${history.map(h => `${h.role}: ${h.parts[0].text}`).join('\n')}\n\nUser: ${userMessage}\n\nRootwise:`;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.9,
      },
    });
    
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("AI generation error:", error);
    return "I'm having trouble responding right now. Please try again or rephrase your question.";
  }
}

/**
 * Extract potential health conditions from user message
 * Returns structured data for health-intake endpoint
 */
export function extractHealthConditions(message: string): {
  conditions: Array<{ name: string; category: "CHRONIC" | "ACUTE" | "SYMPTOM" | "DIAGNOSIS"; notes?: string }>;
  facts: Array<{ key: string; value: Prisma.InputJsonValue; importance: "LOW" | "MEDIUM" | "HIGH" }>;
} | null {
  const conditions: Array<{ name: string; category: "CHRONIC" | "ACUTE" | "SYMPTOM" | "DIAGNOSIS"; notes?: string }> = [];
  const facts: Array<{ key: string; value: Prisma.InputJsonValue; importance: "LOW" | "MEDIUM" | "HIGH" }> = [];

  const lowerMessage = message.toLowerCase();

  // Common condition patterns
  const conditionPatterns: Array<{ pattern: RegExp; name: string; category: "CHRONIC" | "ACUTE" | "SYMPTOM" | "DIAGNOSIS" }> = [
    { pattern: /\b(have|has|diagnosed with|suffering from)\s+(anemia|anaemia)\b/i, name: "Anemia", category: "CHRONIC" as const },
    { pattern: /\b(have|has|diagnosed with)\s+(diabetes|diabetic)\b/i, name: "Diabetes", category: "CHRONIC" as const },
    { pattern: /\b(have|has|diagnosed with)\s+(tachycardia)\b/i, name: "Tachycardia", category: "CHRONIC" as const },
    { pattern: /\b(have|has|diagnosed with)\s+(migraine|migraines)\b/i, name: "Migraine", category: "SYMPTOM" as const },
    { pattern: /\b(have|has|diagnosed with)\s+(thyroid|hypothyroid|hyperthyroid)\b/i, name: "Thyroid Issue", category: "CHRONIC" as const },
  ];

  for (const { pattern, name, category } of conditionPatterns) {
    if (pattern.test(message)) {
      conditions.push({
        name,
        category,
        notes: `Mentioned in conversation: "${message.substring(0, 100)}..."`,
      });
    }
  }

  if (conditions.length > 0) {
    facts.push({
      key: "mentioned_conditions",
      value: conditions.map(c => c.name.toLowerCase()),
      importance: "HIGH",
    });
  }

  return conditions.length > 0 || facts.length > 0 ? { conditions, facts } : null;
}

