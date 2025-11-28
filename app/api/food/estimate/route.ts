import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Estimate nutrition from text description using AI
 * POST /api/food/estimate
 * Body: { description: string, mealType?: string }
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { description, mealType } = body;

    if (!description || description.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a food description" },
        { status: 400 }
      );
    }

    // Use Groq for fast text-based estimation
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a nutrition estimation expert. Given a food description, estimate the nutritional content.

IMPORTANT RULES:
1. Return ONLY valid JSON, no explanation or markdown
2. Be realistic with portion sizes (a burrito is ~400-600 cal, corn balls ~50-80 each)
3. If the description is vague, use typical serving sizes
4. Round calories to nearest 10, macros to nearest whole number

Return this exact JSON structure:
{
  "description": "cleaned up description",
  "calories": number,
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "fiber": number or null (grams),
  "portionSize": "description of portion",
  "confidence": 0.6-0.9 (how confident you are),
  "notes": "brief note about the estimate"
}`
        },
        {
          role: "user",
          content: `Estimate nutrition for: "${description}"${mealType ? ` (${mealType})` : ''}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const textContent = completion.choices[0]?.message?.content;

    if (!textContent) {
      return NextResponse.json(
        { success: false, message: "Could not estimate nutrition" },
        { status: 200 }
      );
    }

    // Parse the JSON response
    let estimation;
    try {
      // Clean potential markdown formatting
      const cleanJson = textContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      estimation = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse estimation response:", textContent);
      return NextResponse.json(
        { success: false, message: "Could not parse estimation" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      estimation: {
        description: estimation.description || description,
        calories: Math.round(estimation.calories || 0),
        protein: Math.round(estimation.protein || 0),
        carbs: Math.round(estimation.carbs || 0),
        fat: Math.round(estimation.fat || 0),
        fiber: estimation.fiber ? Math.round(estimation.fiber) : null,
        portionSize: estimation.portionSize || "1 serving",
        confidence: estimation.confidence || 0.7,
        notes: estimation.notes || null,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Food estimation error:", error);
    return NextResponse.json(
      { success: false, message: "Estimation failed" },
      { status: 200 }
    );
  }
}


