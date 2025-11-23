import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

// Helper to extract health info from natural language
function extractHealthInfo(userMessage: string, aiResponse: string): any {
  const lowerMessage = userMessage.toLowerCase();
  const extracted: any = {};

  // Extract symptoms
  const symptomKeywords = [
    "tired", "fatigue", "exhausted", "headache", "pain", "ache", "sore",
    "dizzy", "nausea", "sick", "fever", "cough", "cold", "anxiety", "stressed",
    "depressed", "sad", "worried", "tense", "tension"
  ];

  const foundSymptoms: string[] = [];
  for (const symptom of symptomKeywords) {
    if (lowerMessage.includes(symptom)) {
      foundSymptoms.push(symptom.charAt(0).toUpperCase() + symptom.slice(1));
    }
  }

  if (foundSymptoms.length > 0) {
    extracted.symptoms = foundSymptoms;
  }

  // Extract energy mentions (e.g. "my energy is low", "feeling a 4 out of 10")
  const energyMatch = lowerMessage.match(/energy.*?(\d+).*?10|(\d+).*?out of.*?10|feeling.*?(\d+)/);
  if (energyMatch) {
    const score = parseInt(energyMatch[1] || energyMatch[2] || energyMatch[3]);
    if (score >= 1 && score <= 10) {
      extracted.energyScore = score;
    }
  }

  // Extract sleep mentions (e.g. "slept 7 hours", "got 8 hours of sleep")
  const sleepMatch = lowerMessage.match(/slept?\s+(\d+\.?\d*)\s*(?:hours?|hrs?)|(\d+\.?\d*)\s*(?:hours?|hrs?)\s+(?:of\s+)?sleep/);
  if (sleepMatch) {
    const hours = parseFloat(sleepMatch[1] || sleepMatch[2]);
    if (hours > 0 && hours <= 24) {
      extracted.sleepHours = `${hours}hr`;
    }
  }

  // Extract water/hydration mentions
  const waterMatch = lowerMessage.match(/drank?\s+(\d+)\s*(?:glasses?|cups?)|(\d+)\s*(?:glasses?|cups?)\s+(?:of\s+)?water/);
  if (waterMatch) {
    const glasses = parseInt(waterMatch[1] || waterMatch[2]);
    if (glasses > 0 && glasses <= 20) {
      extracted.hydrationGlasses = glasses;
    }
  }

  return Object.keys(extracted).length > 0 ? extracted : null;
}

// Save extracted health data
async function saveHealthData(userId: string, extractedData: any) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = `health_${today.toISOString().split("T")[0]}`;

    // Get existing data for today
    const existing = await prisma.userMemory.findUnique({
      where: {
        userId_key: {
          userId,
          key: todayKey,
        },
      },
    });

    const currentData = (existing?.value as any) || {};

    // Merge symptoms (don't duplicate)
    let symptoms = currentData.symptoms || [];
    if (extractedData.symptoms) {
      symptoms = [...new Set([...symptoms, ...extractedData.symptoms])];
    }

    // Update with new data
    const updatedData = {
      ...currentData,
      ...(extractedData.energyScore && { energyScore: extractedData.energyScore }),
      ...(extractedData.sleepHours && { sleepHours: extractedData.sleepHours }),
      ...(extractedData.hydrationGlasses && { hydrationGlasses: extractedData.hydrationGlasses }),
      symptoms,
      lastUpdated: new Date().toISOString(),
    };

    // Save to database
    await prisma.userMemory.upsert({
      where: {
        userId_key: {
          userId,
          key: todayKey,
        },
      },
      update: {
        value: updatedData,
        lastUsedAt: new Date(),
      },
      create: {
        userId,
        key: todayKey,
        value: updatedData,
        importance: "MEDIUM",
        lastUsedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to save health data from chat:", error);
  }
}

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const SYSTEM_PROMPT = `You are Rootwise, a compassionate wellness companion on the user's personal overview page.

IMPORTANT: You have access to the user's profile including their name, age, conditions, and health data. Use this information to personalize your responses.

CONTEXT AWARENESS:
- You REMEMBER the user's name (it's in your context data)
- You know their health conditions and history
- You track their daily metrics
- You're part of their ongoing wellness journey, not a one-off chatbot

STYLE:
- Keep responses concise (2-3 short paragraphs or bullet points)
- Be warm, supportive, and encouraging
- Use their name naturally when appropriate
- Reference their specific data: "I see your energy is at 6/10 today"
- Build on previous conversations when relevant

YOUR ROLE:
- Help interpret their health metrics
- Spot patterns in their data
- Suggest gentle, evidence-based wellness tips
- Encourage healthy habits they're already doing well
- Provide educational information only

SAFETY:
- You do NOT diagnose, treat, or provide medical advice
- Always remind users to consult healthcare providers for medical concerns
- Flag concerning symptoms and suggest seeing a doctor
- Use phrases like "may support", "research suggests", "you might explore"

Be conversational, personal, data-aware, and safety-conscious.`;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Fetch user's health context
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        conditions: {
          where: { isActive: true },
          select: { name: true, category: true, notes: true, diagnosedAt: true },
        },
        userMemories: {
          where: { importance: { in: ["HIGH", "MEDIUM"] } },
          orderBy: { lastUsedAt: "desc" },
          take: 5,
        },
        patientProfile: {
          select: { sex: true, dateOfBirth: true, lifestyleNotes: true }
        },
      },
    });

    // Build context for AI
    let contextPrompt = "";
    
    // User identity
    if (userData?.name) {
      contextPrompt += `\n\n**User's Name:** ${userData.name}`;
    }
    if (userData?.patientProfile?.sex && userData.patientProfile.sex !== "UNKNOWN") {
      contextPrompt += `\n**Sex:** ${userData.patientProfile.sex}`;
    }
    if (userData?.patientProfile?.dateOfBirth) {
      const age = Math.floor((Date.now() - new Date(userData.patientProfile.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      contextPrompt += `\n**Age:** ${age} years old`;
    }
    
    // Current status
    contextPrompt += "\n\n**Current Status:**";
    if (context?.energyScore) contextPrompt += `\n- Energy: ${context.energyScore}/10`;
    if (context?.sleepHours) contextPrompt += `\n- Sleep: ${context.sleepHours}`;
    if (context?.hydrationGlasses) contextPrompt += `\n- Hydration: ${context.hydrationGlasses}/6 glasses`;
    if (context?.symptoms?.length > 0) contextPrompt += `\n- Symptoms: ${context.symptoms.join(", ")}`;

    if (userData?.conditions && userData.conditions.length > 0) {
      contextPrompt += `\n\n**Known Conditions:**\n${userData.conditions.map(c => `- ${c.name} (${c.category})`).join("\n")}`;
    }

    if (userData?.patientProfile?.lifestyleNotes) {
      contextPrompt += `\n\n**Lifestyle Notes:** ${userData.patientProfile.lifestyleNotes}`;
    }
    
    if (userData?.userMemories && userData.userMemories.length > 0) {
      contextPrompt += `\n\n**Important Facts About User:**\n${userData.userMemories.map(m => `- ${m.key}: ${JSON.stringify(m.value)}`).join("\n")}`;
    }

    // Call Groq AI
    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
    
    const completion = await groq.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT + contextPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 512,
      top_p: 0.9,
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim();

    if (!aiResponse || aiResponse.length === 0) {
      throw new Error("AI returned empty response");
    }

    // Extract health data from conversation
    const extractedData = extractHealthInfo(message, aiResponse);
    if (extractedData) {
      await saveHealthData(user.id, extractedData);
      
      // Trigger symptom analysis after logging new health data
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/health/analyze-symptoms`, {
          method: 'POST',
          headers: {
            'Cookie': request.headers.get('Cookie') || '',
          },
        });
      } catch (error) {
        console.error("Failed to trigger symptom analysis:", error);
      }
    }

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      dataExtracted: !!extractedData, // Let frontend know to refresh
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Quick chat error:", error);
    
    // Fallback response if AI fails
    return NextResponse.json({
      response: "I'm having trouble connecting right now. Please try again in a moment. If this persists, check your AI service configuration.",
      timestamp: new Date().toISOString(),
    });
  }
}

