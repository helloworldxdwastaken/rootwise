import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { getLocalDate } from "@/lib/timezone";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const SYMPTOM_ANALYSIS_PROMPT = `You are a wellness data analyst for Rootwise.

YOUR TASK: Analyze today's health metrics and recent chat messages to determine likely symptoms.

OUTPUT FORMAT (JSON only, no other text):
{
  "symptoms": [
    {
      "name": "Fatigue",
      "confidence": "high",
      "reasoning": "Energy score is 3/10 and sleep was only 5 hours"
    },
    {
      "name": "Dehydration Risk",
      "confidence": "medium", 
      "reasoning": "Only 2 glasses of water by afternoon"
    }
  ]
}

RULES:
- Only identify symptoms based on CONCRETE DATA
- Confidence: "high" (clear indicators), "medium" (possible), "low" (speculation)
- Common symptoms: Fatigue, Headache, Dehydration Risk, Low Mood, Stress, Tension, Poor Sleep Quality
- Don't diagnose medical conditions
- Be conservative - better to identify less than overdiagnose
- If data is normal/good, return empty symptoms array
- Consider correlations: low sleep → fatigue, low water → headache risk
`;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { dateKey: todayKey, dateString } = getLocalDate();

    // Get today's metrics
    const todayMetrics = await prisma.userMemory.findUnique({
      where: {
        userId_key: {
          userId: user.id,
          key: todayKey,
        },
      },
    });

    // Get recent chat messages (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentMessages = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: yesterday,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Build context for AI analysis
    const data = (todayMetrics?.value as any) || {};
    
    const contextData = {
      today: {
        date: dateString,
        energyScore: data.energyScore || null,
        sleepHours: data.sleepHours || null,
        hydrationGlasses: data.hydrationGlasses || 0,
        moodScore: data.moodScore || null,
        manualSymptoms: data.symptoms || [],
      },
      recentChat: recentMessages.map(m => ({
        role: m.role,
        content: m.content.substring(0, 200), // First 200 chars
        time: m.createdAt,
      })),
    };

    const analysisPrompt = `Analyze this health data and determine likely symptoms:

${JSON.stringify(contextData, null, 2)}

Remember: Output ONLY valid JSON with symptoms array. If everything looks normal, return empty array.`;

    // Call Groq AI for analysis
    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
    
    const completion = await groq.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: SYMPTOM_ANALYSIS_PROMPT,
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.3, // Low temperature for consistent analysis
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim();

    if (!aiResponse) {
      throw new Error("AI returned empty response");
    }

    // Parse AI response
    let symptoms = [];
    try {
      const parsed = JSON.parse(aiResponse);
      symptoms = parsed.symptoms || [];
    } catch (error) {
      console.error("Failed to parse AI symptom analysis:", error);
      // Fallback: return manual symptoms if any
      symptoms = data.symptoms?.map((name: string) => ({
        name,
        confidence: "user-reported",
        reasoning: "Reported by user",
      })) || [];
    }

    // Save analyzed symptoms back to today's data
    if (todayMetrics) {
      await prisma.userMemory.update({
        where: {
          userId_key: {
            userId: user.id,
            key: todayKey,
          },
        },
        data: {
          value: {
            ...data,
            analyzedSymptoms: symptoms,
            lastAnalyzed: new Date().toISOString(),
          },
          lastUsedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      symptoms,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Symptom analysis error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

