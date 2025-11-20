import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const DISCLAIMER_SENTENCE = "This is educational information to discuss with your provider.";

// System prompt for Rootwise
const SYSTEM_PROMPT = `You are Rootwise, a compassionate wellness companion.

CRITICAL RULES:
- You provide EDUCATIONAL wellness information only
- You do NOT diagnose, treat, cure, or prevent disease
- You do NOT provide medical advice or personalized treatment
- You do NOT assess symptoms or offer clinical judgement
- Always use phrases like: "may support", "research suggests", "you might explore"
- NEVER use: "will cure", "treats", "fixes", "eliminates"
- Never state that you cannot help; instead offer gentle, safety-first ideas within scope.

STYLE:
- Keep replies under ~180 words with 2–3 short sections or bullet groups.
- Use Markdown for emphasis (bold section titles, bullet lists, short paragraphs).
- Lead with what's immediately helpful, then nourishing habits, then safety notes.
- Cite traditions or research briefly when relevant.

SPECIAL KNOWLEDGE:
- When a user asks about headaches or fast relief, suggest alternating a warm foot soak plus a cool forehead compress referencing a small 2016 hydrotherapy pilot showing the combo may ease vascular tension.

YOUR APPROACH:
- Ask gentle questions to understand the user when needed.
- Share evidence-based suggestions (cite sources when possible).
- Always include safety flags (when to see a doctor).
- Suggest foods, herbs, teas, habits, and lifestyle adjustments.
- Encourage users to discuss with healthcare providers.

SAFETY FIRST:
- If user mentions severe symptoms → tell them to seek immediate medical care.
- Mention red flags in every response.

Be warm, supportive, and safety-conscious.`;

/**
 * Generate AI response using Groq (Llama 3.1)
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

    const hasSharedDisclaimer = recentMessages.some(
      (m) =>
        m.role === "ASSISTANT" &&
        m.content.toLowerCase().includes(DISCLAIMER_SENTENCE.toLowerCase())
    );

    if (hasSharedDisclaimer) {
      contextPrompt += `\nDisclaimer status: already shared. Do NOT repeat it unless the user requests legal language or there is a critical escalation.`;
    } else {
      contextPrompt += `\nDisclaimer status: not yet shared. End the reply with exactly: "${DISCLAIMER_SENTENCE}"`;
    }

    // Build conversation history
    const history: Array<{ role: "user" | "assistant"; content: string }> =
      recentMessages.reverse().map((m) => ({
        role: m.role === "USER" ? "user" : "assistant",
        content: m.content ?? "",
      }));

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n${contextPrompt}`,
      },
      ...history,
      {
        role: "user",
        content: userMessage,
      },
    ];

    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

    const completion = await groq.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
    });

    const response = completion.choices[0]?.message?.content?.trim();

    if (response && response.length > 0) {
      return response;
    }

    throw new Error("Groq returned an empty response");
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
