import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const ONBOARDING_SYSTEM_PROMPT = `You are a warm, friendly intake coordinator for Rootwise wellness app.

YOUR GOAL: Gather essential health information through natural, conversational questions.

REQUIRED INFORMATION TO COLLECT (in order):
1. **name** - Full name
2. **dateOfBirth** - Date of birth (format: YYYY-MM-DD)
3. **sex** - Biological sex (MALE, FEMALE, OTHER, UNKNOWN)
4. **conditions** - Any diagnosed medical conditions? (diabetes, hypertension, etc.)
5. **medications** - Current medications (if any)
6. **allergies** - Food or medication allergies
7. **dietary** - Dietary preferences (vegetarian, vegan, gluten-free, lactose-free, nut allergy)
8. **lifestyle** - Work, exercise habits, stress levels
9. **goals** - Why they're using Rootwise, wellness goals

CONVERSATION STYLE:
- Ask ONE question at a time
- Be warm, empathetic, and conversational
- Explain WHY you need each piece of information
- Acknowledge and validate their answers
- Use phrases like "Thank you for sharing", "I understand", "Got it"
- Make it feel like talking to a caring health professional, not filling a form
- If they give vague answers, ask gentle follow-up questions

IMPORTANT RULES:
- NEVER ask multiple questions at once
- Wait for their answer before moving to next topic
- If they mention a condition, ask when diagnosed and any medications
- If they mention medications, check for allergies
- Be extra gentle with sensitive topics (diagnoses, medications)
- Confirm understanding before moving to next question

AFTER COLLECTING ALL INFO:
Summarize everything and ask for confirmation:
"Let me confirm what I've learned:
✅ Name: [name]
✅ Born: [date] (Age X)
✅ Sex: [sex]
[list conditions, meds, allergies, diet, lifestyle, goals]

Does this look correct?"

When they confirm, thank them warmly and say their profile is complete.

EXTRACTION FORMAT:
After EACH user message, you must output structured data at the END of your response in this format:

EXTRACTION_DATA: {
  "extracted": {
    "name": "value or null",
    "dateOfBirth": "YYYY-MM-DD or null",
    "sex": "MALE|FEMALE|OTHER|UNKNOWN or null",
    "conditions": [{"name": "string", "diagnosedAt": "string", "notes": "string"}] or null,
    "medications": ["string"] or null,
    "allergies": ["string"] or null,
    "dietary": {"vegetarian": bool, "vegan": bool, "glutenFree": bool, "lactoseFree": bool, "nutAllergy": bool} or null,
    "lifestyle": "string or null",
    "goals": "string or null"
  },
  "confirmed": false,
  "readyToComplete": false
}

Set "readyToComplete": true only when user confirms the summary.
`;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { message, currentProgress } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get conversation history from database (onboarding session)
    let onboardingSession = await prisma.chatSession.findFirst({
      where: {
        userId: user.id,
        source: "onboarding",
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
    });

    // Create session if doesn't exist
    if (!onboardingSession) {
      onboardingSession = await prisma.chatSession.create({
        data: {
          userId: user.id,
          source: "onboarding",
        },
        include: {
          messages: true,
        },
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: onboardingSession.id,
        userId: user.id,
        role: "USER",
        content: message,
      },
    });

    // Build conversation history for AI
    const conversationHistory = onboardingSession.messages.map((m) => ({
      role: m.role === "USER" ? "user" : "assistant",
      content: m.content,
    }));

    // Add current message
    conversationHistory.push({
      role: "user",
      content: message,
    });

    // Call Groq AI
    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
    
    const completion = await groq.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: ONBOARDING_SYSTEM_PROMPT,
        },
        ...conversationHistory,
      ],
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.9,
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim();

    if (!aiResponse) {
      throw new Error("AI returned empty response");
    }

    // Save AI response
    await prisma.chatMessage.create({
      data: {
        sessionId: onboardingSession.id,
        role: "ASSISTANT",
        content: aiResponse,
      },
    });

    // Extract structured data from AI response
    const extractedData = extractOnboardingData(aiResponse);
    
    // Save extracted data to database
    if (extractedData) {
      await saveOnboardingData(user.id, extractedData);
    }

    // Update progress
    const updatedProgress = {
      ...currentProgress,
      ...calculateProgress(extractedData),
    };

    // Check if onboarding is complete
    const isComplete = extractedData?.readyToComplete === true;

    if (isComplete) {
      // Mark user as onboarded
      await prisma.user.update({
        where: { id: user.id },
        data: {
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
          onboardingProgress: updatedProgress,
        },
      });
    }

    // Clean response (remove extraction data)
    const cleanResponse = aiResponse.split("EXTRACTION_DATA:")[0].trim();

    return NextResponse.json({
      response: cleanResponse,
      progress: updatedProgress,
      completed: isComplete,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Onboarding chat error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

function extractOnboardingData(aiResponse: string): any {
  try {
    const match = aiResponse.match(/EXTRACTION_DATA:\s*({[\s\S]*?})/);
    if (match) {
      return JSON.parse(match[1]);
    }
  } catch (error) {
    console.error("Failed to extract onboarding data:", error);
  }
  return null;
}

function calculateProgress(extractedData: any): Record<string, boolean> {
  if (!extractedData?.extracted) return {};

  const data = extractedData.extracted;
  return {
    name: !!data.name,
    dateOfBirth: !!data.dateOfBirth,
    sex: !!data.sex,
    conditions: Array.isArray(data.conditions) && data.conditions.length > 0,
    allergies: Array.isArray(data.allergies),
    dietary: !!data.dietary,
    lifestyle: !!data.lifestyle,
    goals: !!data.goals,
  };
}

async function saveOnboardingData(userId: string, extractedData: any) {
  const data = extractedData.extracted;
  if (!data) return;

  try {
    // Update User
    if (data.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: data.name },
      });
    }

    // Upsert PatientProfile
    if (data.dateOfBirth || data.sex || data.lifestyle) {
      await prisma.patientProfile.upsert({
        where: { userId },
        update: {
          ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
          ...(data.sex && { sex: data.sex }),
          ...(data.lifestyle && { lifestyleNotes: data.lifestyle }),
        },
        create: {
          userId,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          sex: data.sex || "UNKNOWN",
          lifestyleNotes: data.lifestyle,
        },
      });
    }

    // Create Conditions
    if (Array.isArray(data.conditions) && data.conditions.length > 0) {
      for (const condition of data.conditions) {
        await prisma.condition.create({
          data: {
            userId,
            name: condition.name,
            category: "DIAGNOSIS",
            notes: condition.notes || `Diagnosed ${condition.diagnosedAt || "date unknown"}. ${condition.medications ? `Medications: ${condition.medications}` : ""}`,
            diagnosedAt: condition.diagnosedAt ? new Date(condition.diagnosedAt) : null,
          },
        });
      }
    }

    // Upsert UserProfile (dietary preferences, allergies)
    if (data.dietary || data.allergies) {
      await prisma.userProfile.upsert({
        where: { userId },
        update: {
          ...(data.dietary && {
            vegetarian: data.dietary.vegetarian || false,
            vegan: data.dietary.vegan || false,
            glutenFree: data.dietary.glutenFree || false,
            lactoseFree: data.dietary.lactoseFree || false,
            nutAllergy: data.dietary.nutAllergy || false,
          }),
          ...(data.allergies && data.allergies.length > 0 && {
            otherNotes: `Allergies: ${data.allergies.join(", ")}`,
          }),
        },
        create: {
          userId,
          vegetarian: data.dietary?.vegetarian || false,
          vegan: data.dietary?.vegan || false,
          glutenFree: data.dietary?.glutenFree || false,
          lactoseFree: data.dietary?.lactoseFree || false,
          nutAllergy: data.dietary?.nutAllergy || false,
          otherNotes: data.allergies && data.allergies.length > 0 ? `Allergies: ${data.allergies.join(", ")}` : null,
        },
      });
    }

    // Save goals as UserMemory
    if (data.goals) {
      await prisma.userMemory.upsert({
        where: {
          userId_key: {
            userId,
            key: "wellness_goals",
          },
        },
        update: {
          value: data.goals,
          importance: "HIGH",
          lastUsedAt: new Date(),
        },
        create: {
          userId,
          key: "wellness_goals",
          value: data.goals,
          importance: "HIGH",
          lastUsedAt: new Date(),
        },
      });
    }

    // Save allergies as UserMemory
    if (data.allergies && data.allergies.length > 0) {
      await prisma.userMemory.upsert({
        where: {
          userId_key: {
            userId,
            key: "allergies",
          },
        },
        update: {
          value: data.allergies,
          importance: "HIGH",
          lastUsedAt: new Date(),
        },
        create: {
          userId,
          key: "allergies",
          value: data.allergies,
          importance: "HIGH",
          lastUsedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error saving onboarding data:", error);
  }
}

