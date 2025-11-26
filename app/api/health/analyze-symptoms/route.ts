import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { getLocalDate } from "@/lib/timezone";
import { sendPatternDetectedNotification } from "@/lib/push-service";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const SYMPTOM_ANALYSIS_PROMPT = `You are a wellness data analyst for Rootwise.

YOUR TASK: Analyze today's health metrics, food intake, and recent chat messages to determine likely symptoms and nutritional insights.

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
- Common symptoms: Fatigue, Headache, Dehydration Risk, Low Mood, Stress, Tension, Poor Sleep Quality, Sugar Crash, Overeating, Undereating
- Consider food intake: high sugar/processed foods → energy crashes, low protein → fatigue, excess calories → sluggishness
- Don't diagnose medical conditions
- Be conservative - better to identify less than overdiagnose
- If data is normal/good, return empty symptoms array
- Consider correlations: low sleep → fatigue, low water → headache risk, poor diet → low energy
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

    // Get today's food logs
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const foodLogs = await prisma.foodLog.findMany({
      where: {
        userId: user.id,
        eatenAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
      orderBy: { eatenAt: "desc" },
    });

    // Calculate food totals
    const foodTotals = foodLogs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbs || 0),
        fat: acc.fat + (log.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Get user profile for calorie goal calculation
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: user.id },
    });

    // Calculate BMR and TDEE if we have profile data
    let calorieGoal = 2000; // Default
    if (patientProfile?.weightKg && patientProfile?.heightCm && patientProfile?.dateOfBirth) {
      const age = Math.floor((Date.now() - new Date(patientProfile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      const weight = patientProfile.weightKg;
      const height = patientProfile.heightCm;
      const isMale = patientProfile.sex === 'MALE';
      
      // Mifflin-St Jeor Equation for BMR
      const bmr = isMale
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;
      
      // Assume moderate activity (1.55 multiplier) for TDEE
      const tdee = bmr * 1.55;
      
      // For deficit, subtract 500 calories (1lb/week loss)
      calorieGoal = Math.round(tdee - 500);
    }

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
      nutrition: {
        calorieGoal,
        consumed: foodTotals.calories,
        remaining: calorieGoal - foodTotals.calories,
        protein: foodTotals.protein,
        carbs: foodTotals.carbs,
        fat: foodTotals.fat,
        meals: foodLogs.map(f => ({
          description: f.description,
          calories: f.calories,
          mealType: f.mealType,
        })),
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

    // Send push notification if high-confidence patterns detected
    const highConfidenceSymptoms = symptoms.filter(
      (s: { confidence: string }) => s.confidence === 'high'
    );
    
    if (highConfidenceSymptoms.length > 0) {
      const symptomNames = highConfidenceSymptoms
        .slice(0, 2)
        .map((s: { name: string }) => s.name)
        .join(' and ');
      
      // Send notification asynchronously (don't wait for it)
      sendPatternDetectedNotification(
        user.id,
        `AI detected ${symptomNames}. Tap to see insights and recommendations.`
      ).catch(err => console.log('Push notification error:', err));
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

