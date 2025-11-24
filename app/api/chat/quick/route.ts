import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { getLocalDate, getMidnightInLocalTimezone } from "@/lib/timezone";

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

  // Extract medical conditions mentioned by doctor/diagnosis
  const medicalConditionPatterns = [
    { pattern: /\b(?:doctor|physician|dr\.?)\s+(?:said|told|diagnosed|found|mentioned|confirmed)\s+(?:i\s+have\s+)?([a-z]+(?:megaly|itis|osis|opathy|emia|penia|trophy|plasia|oma))\b/i, name: "$1" },
    { pattern: /\b(?:diagnosed\s+with|have|has)\s+([a-z]+(?:megaly|itis|osis|opathy|emia|penia|trophy|plasia|oma))\b/i, name: "$1" },
    { pattern: /\b(?:doctor|physician)\s+(?:said|told)\s+(?:i\s+have\s+)?([a-z\s]+(?:syndrome|disease|disorder))\b/i, name: "$1" },
    { pattern: /\b(?:diagnosed\s+with|have|has)\s+(anemia|diabetes|hypertension|tachycardia|hypothyroid|hyperthyroid|arthritis|asthma|copd|ibs|gerd|migraine)\b/i, name: "$1" },
  ];

  for (const { pattern, name } of medicalConditionPatterns) {
    const match = userMessage.match(pattern);
    if (match) {
      const conditionName = match[1] || name;
      const formatted = conditionName.trim().split(/\s+/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      foundSymptoms.push(formatted);
    }
  }

  if (foundSymptoms.length > 0) {
    extracted.symptoms = foundSymptoms;
    extracted.medicalCondition = foundSymptoms.some(s => 
      /megaly|itis|osis|opathy|emia|penia|trophy|plasia|oma|syndrome|disease|disorder/i.test(s)
    );
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

  // Extract triggers/causes (what caused the problem)
  const triggerPatterns = [
    { pattern: /because of ([^,.!?]+)/i, group: 1 },
    { pattern: /due to ([^,.!?]+)/i, group: 1 },
    { pattern: /from ([^,.!?]+)/i, group: 1 },
    { pattern: /caused by ([^,.!?]+)/i, group: 1 },
    { pattern: /after ([^,.!?]+)/i, group: 1 },
    { pattern: /think it\'?s ([^,.!?]+)/i, group: 1 },
  ];

  for (const { pattern, group } of triggerPatterns) {
    const match = userMessage.match(pattern);
    if (match && match[group]) {
      extracted.trigger = match[group].trim();
      break;
    }
  }

  // Extract what helped/worked (interventions, treatments, remedies)
  const helpfulKeywords = [
    "helped", "worked", "better", "improved", "relief", "eased", "reduced",
    "fixed", "cured", "solved", "felt good", "feel great", "feeling better"
  ];
  
  const interventionKeywords = [
    "tea", "coffee", "water", "rest", "sleep", "walk", "exercise", "stretch",
    "meditation", "yoga", "vitamin", "supplement", "medicine", "pill", "aspirin",
    "ibuprofen", "massage", "heat", "ice", "cold", "warm", "bath", "shower",
    "reducing screen time", "less screen time", "screen break", "break",
    "deep breath", "breathing", "fresh air"
  ];

  const interventions: string[] = [];
  
  // Look for specific intervention patterns first
  const interventionPatterns = [
    { pattern: /([^,.!?]+)\s+(helped|worked|fixed|solved|eased|reduced)/i, group: 1 },
    { pattern: /(helped|worked|fixed|solved|eased|reduced)\s+(?:by|with)\s+([^,.!?]+)/i, group: 2 },
    { pattern: /after\s+([^,.!?]+)\s+(?:i\s+)?(?:felt|feel)\s+better/i, group: 1 },
    { pattern: /(?:took|did|tried)\s+([^,.!?]+)\s+and\s+(?:it\s+)?(?:helped|worked)/i, group: 1 },
  ];

  for (const { pattern, group } of interventionPatterns) {
    const match = userMessage.match(pattern);
    if (match && match[group]) {
      const intervention = match[group].trim();
      if (intervention.length > 2 && intervention.length < 50) {
        interventions.push(intervention);
      }
    }
  }

  // Also check for known intervention keywords
  for (const helpful of helpfulKeywords) {
    if (lowerMessage.includes(helpful)) {
      for (const intervention of interventionKeywords) {
        if (lowerMessage.includes(intervention)) {
          const helpfulPos = lowerMessage.indexOf(helpful);
          const interventionPos = lowerMessage.indexOf(intervention);
          if (Math.abs(helpfulPos - interventionPos) < 50) {
            interventions.push(intervention.charAt(0).toUpperCase() + intervention.slice(1));
          }
        }
      }
    }
  }

  if (interventions.length > 0) {
    extracted.interventions = [...new Set(interventions)]; // Remove duplicates
  }

  return Object.keys(extracted).length > 0 ? extracted : null;
}

// Save extracted health data
async function saveHealthData(userId: string, extractedData: any) {
  try {
    const { dateKey: todayKey, dateString, year, month, day } = getLocalDate();
    const todayDate = getMidnightInLocalTimezone(dateString);

    // Get existing data for today (from UserMemory - quick access)
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

    // Save to UserMemory (for quick access on overview page)
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

    // ALSO save to HealthJournal (permanent tracking) - one entry per symptom
    if (symptoms.length > 0) {
      for (const symptomName of symptoms) {
        // Check if this symptom is already logged today
        const existing = await prisma.healthJournal.findFirst({
          where: {
            userId,
            date: todayDate,
            symptomName,
          },
        });

        if (!existing) {
          // NEW symptom - create entry with trigger if mentioned
          await prisma.healthJournal.create({
            data: {
              userId,
              date: todayDate,
              symptomName,
              severity: extractedData.energyScore ? (11 - extractedData.energyScore) : undefined,
              triggers: extractedData.trigger || null, // What caused it
              energyLevel: extractedData.energyScore,
              sleepQuality: extractedData.sleepHours ? (extractedData.sleepHours.includes('5') ? 4 : 7) : undefined,
              notes: [
                extractedData.sleepHours ? `Slept ${extractedData.sleepHours}` : null,
                extractedData.hydrationGlasses ? `Drank ${extractedData.hydrationGlasses} glasses` : null,
                'Via AI chat'
              ].filter(Boolean).join('. '),
              // Mark as resolved if they mentioned what helped in the same message
              resolved: extractedData.interventions && extractedData.interventions.length > 0,
              resolvedAt: extractedData.interventions && extractedData.interventions.length > 0 ? new Date() : undefined,
            },
          });
          
          console.log("✅ New HealthJournal entry:", { 
            symptomName, 
            trigger: extractedData.trigger,
            resolved: extractedData.interventions && extractedData.interventions.length > 0
          });
          
          // If they mentioned what helped in the same message, update with full story
          if (extractedData.interventions && extractedData.interventions.length > 0) {
            const created = await prisma.healthJournal.findFirst({
              where: { userId, date: todayDate, symptomName },
            });
            
            if (created) {
              await prisma.healthJournal.update({
                where: { id: created.id },
                data: {
                  notes: `Symptom: ${symptomName} | Cause: ${extractedData.trigger || 'Unknown'} | Solution: ${extractedData.interventions.join(', ')}`,
                },
              });
            }
          }
          
        } else {
          // EXISTING symptom - update with solution or trigger
          const updates: any = {};
          
          // Add trigger if not already set
          if (extractedData.trigger && !existing.triggers) {
            updates.triggers = extractedData.trigger;
          }
          
          // Add solution if mentioned
          if (extractedData.interventions && extractedData.interventions.length > 0) {
            const solution = extractedData.interventions.join(', ');
            updates.resolved = true;
            updates.resolvedAt = new Date();
            
            // Build comprehensive notes: Symptom → Cause → Solution
            updates.notes = [
              `Symptom: ${symptomName}`,
              existing.triggers || extractedData.trigger ? `Cause: ${existing.triggers || extractedData.trigger}` : null,
              `Solution: ${solution}`,
              `Energy: ${extractedData.energyScore || existing.energyLevel || 'N/A'}/10`,
              extractedData.sleepHours ? `Sleep: ${extractedData.sleepHours}` : null,
            ].filter(Boolean).join(' | ');
          }
          
          if (Object.keys(updates).length > 0) {
            await prisma.healthJournal.update({
              where: { id: existing.id },
              data: updates,
            });
            
            console.log("✅ Updated HealthJournal:", { 
              symptomName, 
              trigger: updates.triggers,
              solution: extractedData.interventions,
              resolved: updates.resolved
            });
          }
        }
      }
    }
    
    // Log positive interventions even without symptoms (preventive care)
    if (extractedData.interventions && extractedData.interventions.length > 0 && symptoms.length === 0) {
      await prisma.healthJournal.create({
        data: {
          userId,
          date: todayDate,
          symptomName: "Wellness Activity",
          energyLevel: extractedData.energyScore,
          notes: `Preventive/wellness activity: ${extractedData.interventions.join(', ')}. Via AI chat.`,
          resolved: true,
        },
      });
      
      console.log("✅ Logged wellness activity:", extractedData.interventions);
    }
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

    // Get or create a "quick chat" session for this user
    let session = await prisma.chatSession.findFirst({
      where: {
        userId: user.id,
        title: "Overview Quick Chat",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId: user.id,
          title: "Overview Quick Chat",
        },
      });
    }

    // Get recent conversation history (last 10 messages)
    const recentMessages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

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

    // Build conversation history for AI
    const conversationHistory = recentMessages
      .reverse()
      .map((msg) => ({
        role: msg.role === "USER" ? "user" as const : "assistant" as const,
        content: msg.content || "",
      }));

    // Call Groq AI with conversation history
    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
    
    const completion = await groq.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT + contextPrompt,
        },
        ...conversationHistory,
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

    // Save user message to history
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        userId: user.id,
        role: "USER",
        content: message,
      },
    });

    // Save AI response to history
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        userId: null, // AI messages don't have userId
        role: "ASSISTANT",
        content: aiResponse,
      },
    });

    // Extract health data from conversation
    const extractedData = extractHealthInfo(message, aiResponse);
    if (extractedData) {
      await saveHealthData(user.id, extractedData);
      
      // If this is a medical condition, also add it to the user's conditions
      if (extractedData.medicalCondition && extractedData.symptoms) {
        for (const symptom of extractedData.symptoms) {
          const existing = await prisma.condition.findFirst({
            where: {
              userId: user.id,
              name: symptom,
            },
          });

          if (!existing) {
            await prisma.condition.create({
              data: {
                userId: user.id,
                name: symptom,
                category: "DIAGNOSIS",
                notes: `Mentioned in chat: "${message.substring(0, 100)}..."`,
                isActive: true,
              },
            });
            console.log("✅ Added medical condition:", symptom);
          }
        }
      }
      
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

